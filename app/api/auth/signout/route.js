import { NextResponse } from "next/server";
import { getSession, getSessionOptions } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  session.destroy();

  const res = NextResponse.json({ ok: true });
  const opts = getSessionOptions();
  res.cookies.set(opts.cookieName, "", {
    ...opts.cookieOptions,
    maxAge: 0,
  });
  return res;
}
