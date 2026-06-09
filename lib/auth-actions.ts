"use server";

import { signIn, signOut } from "@/auth";

export async function signInDiscord() {
  await signIn("discord", { redirectTo: "/profile" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
