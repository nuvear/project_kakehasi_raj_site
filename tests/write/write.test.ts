import { expect, test, describe, beforeAll } from "vitest";
import { POST as contactPOST } from "../../apps/web/app/api/write/contact/route.ts";
import { POST as feedbackPOST } from "../../apps/web/app/api/write/feedback/route.ts";
import { POST as proposalsPOST, PATCH as proposalsPATCH } from "../../apps/web/app/api/write/proposals/route.ts";
import { NextRequest } from "next/server";

beforeAll(() => {
  process.env.MOCK_DB = "true";
  process.env.OWNER_SECRET_KEY = "super-secret-key-123";
});

describe("Phase 8 Write APIs — Validation & Error Handling", () => {
  test("contact route blocks invalid email", async () => {
    const req = new NextRequest("http://localhost/api/write/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": "idem-1"
      },
      body: JSON.stringify({
        name: "Test User",
        email: "not-an-email",
        subject: "Hello",
        message: "This is a test message of sufficient length."
      })
    });
    const res = await contactPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });

  test("feedback route blocks short comments", async () => {
    const req = new NextRequest("http://localhost/api/write/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": "idem-2"
      },
      body: JSON.stringify({
        category: "general",
        rating: 5,
        comment: "bad" // 3 characters, fails z.string().min(5)
      })
    });
    const res = await feedbackPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });

  test("contact route blocks missing idempotency key", async () => {
    const req = new NextRequest("http://localhost/api/write/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        subject: "Hello",
        message: "This is a test message of sufficient length."
      })
    });
    const res = await contactPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Missing x-idempotency-key");
  });
});

describe("Phase 8 Write APIs — Idempotency & Rate Limiting", () => {
  test("contact route enforces idempotency (double submission is safe)", async () => {
    const payload = {
      name: "Test User",
      email: "test@example.com",
      subject: "Hello",
      message: "This is a test message of sufficient length."
    };
    const key = "unique-key-999";

    // First call
    const req1 = new NextRequest("http://localhost/api/write/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": key,
        "x-forwarded-for": "10.0.0.1"
      },
      body: JSON.stringify(payload)
    });
    const res1 = await contactPOST(req1);
    expect(res1.status).toBe(200);

    // Second call with same key
    const req2 = new NextRequest("http://localhost/api/write/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": key,
        "x-forwarded-for": "10.0.0.1"
      },
      body: JSON.stringify(payload)
    });
    const res2 = await contactPOST(req2);
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.success).toBe(true);
  });

  test("contact route rate-limits requests", async () => {
    const payload = {
      name: "Test User",
      email: "test@example.com",
      subject: "Hello",
      message: "This is a test message of sufficient length."
    };

    // Make 3 successful calls from isolated IP
    for (let i = 0; i < 3; i++) {
      const req = new NextRequest("http://localhost/api/write/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": `rate-key-${i}`,
          "x-forwarded-for": "192.168.10.10"
        },
        body: JSON.stringify(payload)
      });
      const res = await contactPOST(req);
      expect(res.status).toBe(200);
    }

    // 4th call should hit the rate-limit of 3 per hour
    const req4 = new NextRequest("http://localhost/api/write/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": "rate-key-4",
        "x-forwarded-for": "192.168.10.10"
      },
      body: JSON.stringify(payload)
    });
    const res4 = await contactPOST(req4);
    expect(res4.status).toBe(429);
    const data4 = await res4.json();
    expect(data4.error).toContain("Too many requests");
  });
});

describe("Phase 8 Write APIs — Owner Authentication & Proposals", () => {
  test("proposals POST creates pending proposal", async () => {
    const req = new NextRequest("http://localhost/api/write/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": "proposal-key-1"
      },
      body: JSON.stringify({
        entityId: "profile.about",
        fields: { role: "Chief AI Officer" },
        rationale: "Update to reflect new role"
      })
    });
    const res = await proposalsPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.proposalId).toBeDefined();
  });

  test("proposals PATCH blocks unauthorized approvals", async () => {
    const req = new NextRequest("http://localhost/api/write/proposals", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        proposalId: "proposal_123"
      })
    });
    const res = await proposalsPATCH(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  test("proposals PATCH allows authorized approvals with correct secret key", async () => {
    // 1. Create a proposal
    const createReq = new NextRequest("http://localhost/api/write/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": "proposal-key-auth-ok"
      },
      body: JSON.stringify({
        entityId: "profile.about",
        fields: { role: "AI Visionary Leader" },
        rationale: "Updated mock role"
      })
    });
    const createRes = await proposalsPOST(createReq);
    const createData = await createRes.json();
    const proposalId = createData.proposalId;

    // 2. Approve proposal with correct owner token
    const approveReq = new NextRequest("http://localhost/api/write/proposals", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-owner-token": "super-secret-key-123"
      },
      body: JSON.stringify({
        proposalId
      })
    });
    const approveRes = await proposalsPATCH(approveReq);
    expect(approveRes.status).toBe(200);
    const approveData = await approveRes.json();
    expect(approveData.success).toBe(true);
  });
});
