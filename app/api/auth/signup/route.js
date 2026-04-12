import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { getClientIp } from "@/lib/request";
import { checkRateLimit, rateLimitKey } from "@/lib/rateLimit";
import { signupSchema } from "@/lib/validation";
import { createUser, getUserByEmail } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  const ip = getClientIp(request);
  const key = rateLimitKey(ip, "auth:signup");
  const limited = checkRateLimit(key, { limit: 10, windowMs: 10 * 60 * 1000 });
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

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { username, email, password } = parsed.data;
  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account already exists for this email" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash,
    balance: 0,
    createdAt: new Date().toISOString(),
  };

  await createUser(user);

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        balance: user.balance,
        createdAt: user.createdAt,
      },
    },
    { status: 201 }
  );
}
