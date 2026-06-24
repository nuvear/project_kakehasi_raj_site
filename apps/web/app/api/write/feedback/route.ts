import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";
import { FeedbackSchema } from "@kakehashi/content-schema";

async function getIpHash(req: NextRequest): Promise<string> {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  const db = await getDatabase();
  const ipHash = await getIpHash(req);

  // 1. Check Idempotency Key
  const idempotencyKey = req.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return NextResponse.json({ error: "Missing x-idempotency-key header" }, { status: 400 });
  }

  // 2. Check Rate Limit (e.g., 5 requests per 15 minutes)
  const rateLimit = await db.checkRateLimit(ipHash, "feedback", 5, 900);
  if (!rateLimit.allowed) {
    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "submit_feedback",
      actor: ipHash,
      status: "blocked",
      details: { reason: "rate_limit_exceeded" }
    });
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 3. Parse and Validate Request Body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = FeedbackSchema.safeParse(body);
  if (!result.success) {
    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "submit_feedback",
      actor: ipHash,
      status: "failure",
      details: { errors: result.error.errors }
    });
    return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
  }

  // 4. Save Request
  try {
    const success = await db.saveFeedback(result.data, idempotencyKey);
    if (!success) {
      throw new Error("Database transaction failed");
    }

    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "submit_feedback",
      actor: ipHash,
      status: "success",
      details: { category: result.data.category, rating: result.data.rating }
    });

    return NextResponse.json({ success: true, remainingLimits: rateLimit.remaining });
  } catch (err) {
    console.error("Failed to save feedback:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
