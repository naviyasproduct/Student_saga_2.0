import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { getClientIp } from "@/lib/request";
import { checkRateLimit, rateLimitKey } from "@/lib/rateLimit";
import { signinSchema } from "@/lib/validation";
import { getUserByEmail } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  const ip = getClientIp(request);
  const key = rateLimitKey(ip, "auth:signin");
  const limited = checkRateLimit(key, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = signinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      balance: user.balance ?? 0,
      createdAt: user.createdAt,
    },
  });
}
