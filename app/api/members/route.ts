import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth-helpers";
import { searchMembers } from "@/lib/community";

/** Member lookup for the @mention picker. Signed in members only. */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ members: [] }, { status: 401 });

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 1) return NextResponse.json({ members: [] });

  const members = await searchMembers(q);
  return NextResponse.json({
    members: members
      .filter((m) => m.handle)
      .map((m) => ({ handle: m.handle, name: m.name, image: m.image })),
  });
}
