import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

function getSessionPassword() {
  const pwd = process.env.SESSION_PASSWORD;
  if (pwd && pwd.length >= 32) return pwd;

  if (isProd) {
    throw new Error(
      "SESSION_PASSWORD must be set to a 32+ character secret in production"
    );
  }

  // Dev-only fallback: keeps local dev simple.
  return "dev-only-session-password-change-me-please-32chars";
}

export const sessionOptions = {
  // Intentionally left for backward-compat exports; do not read secrets here.
};

export function getSessionOptions() {
  return {
    password: getSessionPassword(),
    cookieName: "student_saga_session",
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
    },
  };
}

export async function getSession() {
  return getIronSession(cookies(), getSessionOptions());
}

export async function requireUserId() {
  const session = await getSession();
  if (!session?.userId) return null;
  return session.userId;
}
