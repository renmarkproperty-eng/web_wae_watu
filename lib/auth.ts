import { cookies } from "next/headers";
import { getCMSContent } from "./cms";

const COOKIE_NAME = "wae_watu_admin_session";
const SESSION_SECRET = "wae-watu-cms-secret-key-2026";

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  const token = Buffer.from(`${username}:${SESSION_SECRET}:${Date.now()}`).toString("base64");
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username, secret] = decoded.split(":");
    if (secret !== SESSION_SECRET) return false;

    const cms = await getCMSContent();
    return username === cms.admin.username;
  } catch {
    return false;
  }
}
