import { cookies } from "next/headers";

export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return sessionId;
}
