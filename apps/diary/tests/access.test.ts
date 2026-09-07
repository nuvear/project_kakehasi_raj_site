import { beforeEach, describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
const test = vi.hoisted(() => ({
  data: new Map<string, any>(),
  token: { uid: "a", email: "a@example.com", email_verified: true },
  verify: vi.fn(),
}));
vi.mock("firebase-admin/app", () => ({
  getApps: () => [{}],
  initializeApp: () => ({}),
  applicationDefault: () => ({}),
}));
vi.mock("firebase-admin/auth", () => ({
  getAuth: () => ({ verifyIdToken: test.verify }),
}));
function ref(path: string): any {
  return {
    id: path.split("/").at(-1),
    get: async () => ({
      exists: test.data.has(path),
      data: () => test.data.get(path),
    }),
    path,
  };
}
vi.mock("firebase-admin/firestore", () => ({
  getFirestore: () => ({
    collection: (name: string) => ({
      doc: (id = "audit") => ref(`${name}/${id}`),
    }),
    runTransaction: async (fn: any) =>
      fn({
        get: (r: any) => r.get(),
        set: (r: any, v: any) => test.data.set(r.path, v),
        create: (r: any, v: any) => test.data.set(r.path, v),
        update: (r: any, v: any) =>
          test.data.set(r.path, { ...test.data.get(r.path), ...v }),
      }),
  }),
}));
import { GET, POST, PUT, PATCH } from "../app/api/[...path]/route";
import { freshState, stateSchema, valuePool } from "../lib/model";
const member = (uid: string, role = "participant", status = "active") => ({
  uid,
  email: `${uid}@example.com`,
  name: uid,
  role,
  status,
  createdAt: "2026-09-05",
});
async function call(path: string, method = "GET", data?: any, token = "valid") {
  const req = new NextRequest(`https://www.rajagobalan.com/diary/api/${path}`, {
    method,
    headers: token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  const fn = ({ GET, POST, PUT, PATCH } as any)[method];
  return fn(req, { params: Promise.resolve({ path: path.split("/") }) });
}
beforeEach(() => {
  test.data.clear();
  test.token = { uid: "a", email: "a@example.com", email_verified: true };
  test.verify.mockReset();
  test.verify.mockImplementation(async () => test.token);
  test.data.set("diaryMembers/a", member("a"));
  process.env.DIARY_OWNER_EMAIL = "owner@example.com";
});
describe("server access boundaries", () => {
  it("rejects anonymous requests to content, state and administration", async () => {
    for (const p of ["content", "state", "members"])
      expect((await call(p, "GET", undefined, "")).status).toBe(401);
  });
  it("checks token revocation with Firebase Admin", async () => {
    await call("state");
    expect(test.verify).toHaveBeenCalledWith("valid", true);
  });
  it("rejects invalid identity tokens", async () => {
    test.verify.mockRejectedValue(new Error("invalid"));
    expect((await call("state")).status).toBe(401);
  });
  it("requires verified email", async () => {
    test.token.email_verified = false;
    expect((await call("content")).status).toBe(403);
  });
  it("excludes pending and revoked participants", async () => {
    for (const status of ["pending", "revoked"]) {
      test.data.set("diaryMembers/a", member("a", "participant", status));
      expect((await call("content")).status).toBe(403);
      expect(
        (await call("state", "PUT", { state: freshState(), version: 0 }))
          .status,
      ).toBe(403);
    }
  });
  it("never uses a supplied owner ID to read someone else’s diary", async () => {
    test.data.set("diaryStates/b", {
      state: { reflections: { private: "B secret" } },
      version: 1,
    });
    const res = await call("state?uid=b");
    expect(res.status).toBe(404);
    const allowed = await call("state");
    expect(JSON.stringify(await allowed.json())).not.toContain("B secret");
  });
  it("writes only to the authenticated participant, ignoring forged owner fields", async () => {
    const res = await call("state", "PUT", {
      uid: "b",
      state: freshState(),
      version: 0,
    });
    expect(res.status).toBe(200);
    expect(test.data.has("diaryStates/a")).toBe(true);
    expect(test.data.has("diaryStates/b")).toBe(false);
  });
  it("rejects stale saves without overwriting existing data", async () => {
    test.data.set("diaryStates/a", {
      state: { reflections: { a: "retain me" } },
      version: 3,
    });
    const res = await call("state", "PUT", { state: freshState(), version: 2 });
    expect(res.status).toBe(409);
    expect(test.data.get("diaryStates/a").state.reflections.a).toBe(
      "retain me",
    );
  });
  it("prevents participants from managing accounts", async () => {
    expect(
      (
        await call("members", "PATCH", {
          uid: "b",
          role: "admin",
          status: "active",
        })
      ).status,
    ).toBe(403);
  });
  it("allows admins to revoke others and writes an audit record", async () => {
    test.data.set("diaryMembers/a", member("a", "admin"));
    test.data.set("diaryMembers/b", member("b"));
    expect(
      (
        await call("members", "PATCH", {
          uid: "b",
          role: "participant",
          status: "revoked",
        })
      ).status,
    ).toBe(200);
    expect(test.data.get("diaryMembers/b").status).toBe("revoked");
    expect(test.data.get("diaryAccessAudit/audit").actor).toBe("a");
  });
  it("prevents an admin from changing their own access", async () => {
    test.data.set("diaryMembers/a", member("a", "admin"));
    expect(
      (
        await call("members", "PATCH", {
          uid: "a",
          role: "participant",
          status: "revoked",
        })
      ).status,
    ).toBe(403);
  });
  it("creates new participants as pending, with no client role escalation", async () => {
    test.data.delete("diaryMembers/a");
    expect(
      (await call("account", "POST", { role: "admin", status: "active" }))
        .status,
    ).toBe(200);
    expect(test.data.get("diaryMembers/a").status).toBe("pending");
    expect(test.data.get("diaryMembers/a").role).toBe("participant");
  });
  it("bootstraps only the verified configured owner", async () => {
    test.data.delete("diaryMembers/a");
    test.token.email = "owner@example.com";
    await call("account", "POST");
    expect(test.data.get("diaryMembers/a").role).toBe("admin");
  });
  it("serves all twelve chapters only after authorization", async () => {
    const response = await call("content");
    expect(response.status).toBe(200);
    expect((await response.json()).weeks).toHaveLength(12);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});
describe("workbook compatibility and validation", () => {
  it("preserves the original value-pool calculation", () =>
    expect(valuePool(freshState().heatmapRows)).toBe(8600000));
  it("rejects malformed and excessive import values", () => {
    expect(
      stateSchema.safeParse({
        ...freshState(),
        heatmapRows: [{ ...freshState().heatmapRows[0], impact: 101 }],
      }).success,
    ).toBe(false);
    expect(
      stateSchema.safeParse({
        ...freshState(),
        reflections: { q: "x".repeat(20001) },
      }).success,
    ).toBe(false);
  });
  it("preserves original backup field names and safely strips unknown keys", () => {
    const input = {
      ...freshState(),
      reflections: { week3_q0: "<script>private text</script>" },
      isAdmin: true,
    };
    const parsed = stateSchema.parse(input);
    expect(parsed.reflections.week3_q0).toBe(input.reflections.week3_q0);
    expect("isAdmin" in parsed).toBe(false);
  });
});
