"use client";

import { Link } from "next-view-transitions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SessionUser {
  name?: string | null;
  image?: string | null;
}

interface AuthButtonProps {
  user: SessionUser | null;
  className?: string;
}

export function AuthButton({ user, className }: AuthButtonProps) {
  if (!user) {
    return (
      <Link
        href="/signin"
        className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4", className)}
      >
        Sign in
      </Link>
    );
  }

  const initials = (user.name ?? "U").slice(0, 2).toUpperCase();

  return (
    <Link
      href="/profile"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 transition-colors hover:border-neon/50",
        className,
      )}
    >
      <Avatar className="size-7">
        <AvatarImage src={user.image ?? undefined} alt="" />
        <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
      </Avatar>
      <span className="max-w-[8rem] truncate text-sm font-medium">{user.name}</span>
    </Link>
  );
}
