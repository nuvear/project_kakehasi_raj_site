import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";
import { ContentProposalSchema } from "@kakehashi/content-schema";

async function getIpHash(req: NextRequest): Promise<string> {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// POST: Create a content proposal (public or agent-initiated)
export async function POST(req: NextRequest) {
  const db = await getDatabase();
  const ipHash = await getIpHash(req);

  // 1. Check Idempotency Key
  const idempotencyKey = req.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return NextResponse.json({ error: "Missing x-idempotency-key header" }, { status: 400 });
  }

  // 2. Check Rate Limit (e.g., 2 proposals per hour)
  const rateLimit = await db.checkRateLimit(ipHash, "proposal_create", 2, 3600);
  if (!rateLimit.allowed) {
    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "create_proposal",
      actor: ipHash,
      status: "blocked",
      details: { reason: "rate_limit_exceeded" }
    });
    return NextResponse.json(
      { error: "Too many content proposals. Please try again later." },
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

  const result = ContentProposalSchema.safeParse(body);
  if (!result.success) {
    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "create_proposal",
      actor: ipHash,
      status: "failure",
      details: { errors: result.error.errors }
    });
    return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
  }

  // 4. Save Proposal
  try {
    const proposalId = await db.createContentProposal(result.data, idempotencyKey);
    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "create_proposal",
      actor: ipHash,
      status: "success",
      details: { proposalId, entityId: result.data.entityId }
    });

    return NextResponse.json({ success: true, proposalId });
  } catch (err) {
    console.error("Failed to create proposal:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Approve a content proposal (Owner only)
export async function PATCH(req: NextRequest) {
  const db = await getDatabase();
  const ipHash = await getIpHash(req);

  // 1. Authenticate Owner
  const ownerToken = req.headers.get("x-owner-token");
  const expectedSecret = process.env.OWNER_SECRET_KEY || "test-owner-secret";

  if (!ownerToken || ownerToken !== expectedSecret) {
    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "approve_proposal",
      actor: ipHash,
      status: "blocked",
      details: { reason: "unauthorized_owner_attempt" }
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 2. Parse Proposal ID
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { proposalId } = body;
  if (!proposalId) {
    return NextResponse.json({ error: "Missing proposalId in body" }, { status: 400 });
  }

  // 3. Approve Proposal
  try {
    const success = await db.approveContentProposal(proposalId, "owner");
    if (!success) {
      await db.logAudit({
        id: `audit_${crypto.randomUUID()}`,
        timestamp: new Date().toISOString(),
        action: "approve_proposal",
        actor: "owner",
        status: "failure",
        details: { proposalId, reason: "proposal_not_found_or_invalid" }
      });
      return NextResponse.json({ error: "Proposal not found or invalid" }, { status: 404 });
    }

    await db.logAudit({
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      action: "approve_proposal",
      actor: "owner",
      status: "success",
      details: { proposalId }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to approve proposal:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
