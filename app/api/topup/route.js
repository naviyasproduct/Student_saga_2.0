import { NextResponse } from "next/server";
import crypto from "crypto";

import { getClientIp } from "@/lib/request";
import { checkRateLimit, rateLimitKey } from "@/lib/rateLimit";
import { topupSchema } from "@/lib/validation";
import { addTopup, getUserById, updateUser } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function POST(request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const key = rateLimitKey(ip, "topup");
  const limited = checkRateLimit(key, { limit: 30, windowMs: 10 * 60 * 1000 });
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

  const parsed = topupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const amount = parsed.data.amount;
  const newBalance = (user.balance ?? 0) + amount;
  const updated = await updateUser(userId, { balance: newBalance });

  await addTopup({
    id: crypto.randomUUID(),
    userId,
    amount,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    balance: updated?.balance ?? newBalance,
  });
}
