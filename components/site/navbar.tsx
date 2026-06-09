"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthButton, type SessionUser } from "@/components/site/auth-button";
import { Logo } from "@/components/site/logo";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GAMES, NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: SessionUser | null;
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border/60"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${SITE.name} home`} className="group/logo">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger className="group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[popup-open]:text-foreground">
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-data-[popup-open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <DropdownMenuItem
                        key={child.href}
                        render={<Link href={child.href} />}
                        className="gap-2.5"
                      >
                        {ChildIcon ? (
                          <ChildIcon className="size-4 text-muted-foreground" />
                        ) : null}
                        {child.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href!)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/donate"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden h-9 px-3 text-magenta hover:text-magenta sm:inline-flex",
            )}
          >
            <Heart className="size-4" />
            Donate
          </Link>
          <div className="hidden sm:block">
            <AuthButton user={user} />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md text-foreground lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div
              className="flex flex-col gap-1 px-5 py-6"
              onClick={() => setOpen(false)}
            >
              <span className="px-3 pb-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Games
              </span>
              {GAMES.map((g) => {
                const Icon = g.icon;
                return (
                  <Link
                    key={g.slug}
                    href={`/${g.slug}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-card"
                  >
                    <Icon className="size-5 text-muted-foreground" />
                    {g.name}
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-border" />

              {NAV.filter((i) => i.href).map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="rounded-lg px-3 py-3 text-base font-medium hover:bg-card"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-border" />

              <Link
                href="/donate"
                className="rounded-lg px-3 py-3 text-base font-medium text-magenta hover:bg-card"
              >
                Donate
              </Link>

              <div className="mt-4 flex flex-col gap-3">
                <AuthButton user={user} className="justify-center" />
                <DiscordCTAInline />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function DiscordCTAInline() {
  return (
    <a
      href={SITE.discordInvite}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-6 text-sm font-semibold text-white"
    >
      Join the Discord
    </a>
  );
}
