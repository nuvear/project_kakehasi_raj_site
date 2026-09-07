import { NextRequest } from "next/server";
import { z } from "zod";
import {
  authorize,
  body,
  db,
  failure,
  HttpError,
  identify,
  json,
  memberFor,
} from "@/lib/server";
import {
  freshState,
  mayUpdateMember,
  stateSchema,
  type Member,
} from "@/lib/model";
import content from "@/content/diary.json";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
async function handle(req: NextRequest, ctx: Context) {
  try {
    const path = (await ctx.params).path.join("/");
    if (path === "health" && req.method === "GET")
      return json({ status: "ok" });
    if (path === "account") {
      const token = await identify(req);
      let member = await memberFor(token.uid);
      if (req.method === "POST" && !member) {
        const owner =
          token.email!.toLowerCase() ===
          (process.env.DIARY_OWNER_EMAIL || "").toLowerCase();
        const candidate: Member = {
          uid: token.uid,
          email: token.email!,
          name: token.name || "",
          role: owner ? "admin" : "participant",
          status: owner ? "active" : "pending",
          createdAt: new Date().toISOString(),
        };
        const ref = db().collection("diaryMembers").doc(token.uid);
        await db().runTransaction(async (tx) => {
          const existing = await tx.get(ref);
          if (!existing.exists) tx.create(ref, candidate);
        });
        member = await memberFor(token.uid);
      }
      if (!["GET", "POST"].includes(req.method))
        throw new HttpError(405, "Method not allowed.");
      return json({ member: member || null });
    }
    const actor = await authorize(req, path === "members");
    if (path === "content" && req.method === "GET") return json(content);
    if (path === "state") {
      const ref = db().collection("diaryStates").doc(actor.uid);
      if (req.method === "GET") {
        const snap = await ref.get();
        return json(
          snap.exists ? snap.data() : { state: freshState(), version: 0 },
        );
      }
      if (req.method === "PUT") {
        const payload = z
          .object({
            state: stateSchema,
            version: z.number().int().nonnegative(),
          })
          .parse(await body(req));
        await db().runTransaction(async (tx) => {
          const [saved, membership] = await Promise.all([
            tx.get(ref),
            tx.get(db().collection("diaryMembers").doc(actor.uid)),
          ]);
          if (membership.data()?.status !== "active")
            throw new HttpError(403, "Your access has changed.");
          if ((saved.data()?.version || 0) !== payload.version)
            throw new HttpError(
              409,
              "This diary changed in another session. Export your unsaved work before loading the latest version.",
            );
          tx.set(ref, {
            state: payload.state,
            version: payload.version + 1,
            updatedAt: new Date().toISOString(),
          });
        });
        return json({ version: payload.version + 1 });
      }
    }
    if (path === "members") {
      if (req.method === "GET") {
        const cursor = req.nextUrl.searchParams.get("after");
        let query = db().collection("diaryMembers").orderBy("uid").limit(100);
        if (cursor) query = query.startAfter(cursor);
        const snap = await query.get();
        return json({
          members: snap.docs.map((d) => d.data()),
          next: snap.size === 100 ? snap.docs.at(-1)!.id : null,
        });
      }
      if (req.method === "PATCH") {
        const input = z
          .object({
            uid: z
              .string()
              .min(1)
              .max(128)
              .regex(/^[^/]+$/),
            status: z.enum(["active", "revoked", "pending"]),
            role: z.enum(["admin", "participant"]),
          })
          .strict()
          .parse(await body(req));
        const ref = db().collection("diaryMembers").doc(input.uid);
        await db().runTransaction(async (tx) => {
          const [a, t] = await Promise.all([
            tx.get(db().collection("diaryMembers").doc(actor.uid)),
            tx.get(ref),
          ]);
          const target = t.data() as Member | undefined;
          if (!target) throw new HttpError(404, "Account not found.");
          if (
            !mayUpdateMember(a.data() as Member, target) ||
            target.email.toLowerCase() ===
              (process.env.DIARY_OWNER_EMAIL || "").toLowerCase()
          )
            throw new HttpError(403, "This account cannot be changed here.");
          tx.update(ref, { status: input.status, role: input.role });
          tx.create(db().collection("diaryAccessAudit").doc(), {
            actor: actor.uid,
            target: input.uid,
            status: input.status,
            role: input.role,
            at: new Date().toISOString(),
          });
        });
        return json({ ok: true });
      }
    }
    throw new HttpError(404, "Not found.");
  } catch (e) {
    return failure(e);
  }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
