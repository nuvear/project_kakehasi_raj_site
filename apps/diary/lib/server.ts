import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import type { Member } from "./model";
const app = () =>
  getApps()[0] ||
  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || "rajagobalan-site",
  });
export const db = () => getFirestore(app());
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function identify(req: NextRequest) {
  const bearer = req.headers.get("authorization");
  if (!bearer?.startsWith("Bearer "))
    throw new HttpError(401, "Please sign in to continue.");
  try {
    const token = await getAuth(app()).verifyIdToken(bearer.slice(7), true);
    if (!token.email || !token.email_verified)
      throw new HttpError(
        403,
        "Verify your email address, then refresh your access.",
      );
    return token;
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(401, "Your session has expired. Please sign in again.");
  }
}
export async function memberFor(uid: string) {
  return (await db().collection("diaryMembers").doc(uid).get()).data() as
    | Member
    | undefined;
}
export async function authorize(req: NextRequest, admin = false) {
  const token = await identify(req);
  const member = await memberFor(token.uid);
  if (member?.status !== "active" || (admin && member.role !== "admin"))
    throw new HttpError(
      403,
      "Your account does not have access to this action.",
    );
  return member;
}
export async function body(req: NextRequest) {
  if (Number(req.headers.get("content-length") || 0) > 600000)
    throw new HttpError(413, "This backup is too large.");
  const reader = req.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing request.");
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 600000) {
      await reader.cancel();
      throw new HttpError(413, "This backup is too large.");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid request.");
  }
}
export const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "private, no-store", Vary: "Authorization" },
  });
export function failure(e: unknown) {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  if (e instanceof Error && e.name === "ZodError")
    return json(
      { error: "Some values are invalid. Check your entries or backup file." },
      400,
    );
  console.error("Diary service error", e instanceof Error ? e.name : "unknown");
  return json(
    { error: "We could not reach your saved diary. Please try again." },
    503,
  );
}
