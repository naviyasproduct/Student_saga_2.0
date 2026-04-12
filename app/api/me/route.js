import { NextResponse } from "next/server";
import { getUserById } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

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
