import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAuthConfigured, isDbConfigured } from "@/lib/env";

export interface CurrentUser {
  id: string;
  name: string | null;
  image: string | null;
}

/** The signed in member, or null. Never throws. */
export async function currentUser(): Promise<CurrentUser | null> {
  if (!isAuthConfigured || !isDbConfigured) return null;
  try {
    const session = await auth();
    if (!session?.user?.id) return null;
    return {
      id: session.user.id,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    };
  } catch {
    return null;
  }
}

/** The signed in member, or a walk to the front desk. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await currentUser();
  if (!user) redirect("/signin");
  return user;
}
