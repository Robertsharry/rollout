import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="grid min-h-[78vh] place-items-center px-5">
      <div className="text-center">
        <div className="font-display text-7xl font-bold text-gradient sm:text-8xl">
          404
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">
          No such stateroom
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          That door is not on the ship’s plan. Let us walk you back to the
          foyer.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-7 h-11 px-6")}
        >
          <ArrowLeft className="size-4" />
          Return to the foyer
        </Link>
      </div>
    </div>
  );
}
