import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AuthorChip as AuthorData } from "@/lib/community";
import { cn } from "@/lib/utils";

interface AuthorChipProps {
  author: AuthorData;
  meta?: string;
  className?: string;
}

export function AuthorChip({ author, meta, className }: AuthorChipProps) {
  const initials = (author.name ?? "P").slice(0, 2).toUpperCase();
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <Avatar className="size-6">
        <AvatarImage src={author.image ?? undefined} alt="" />
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate text-sm font-medium">
        {author.name ?? "A patron"}
      </span>
      {author.handle ? (
        <span className="font-mono text-[11px] text-gold-light">
          @{author.handle}
        </span>
      ) : null}
      {meta ? (
        <span className="font-mono text-[11px] whitespace-nowrap text-muted-foreground">
          · {meta}
        </span>
      ) : null}
    </span>
  );
}
