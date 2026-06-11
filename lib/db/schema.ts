import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/* ------------------------------------------------------------------ Auth.js */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

/* --------------------------------------------------------------- Rollout app */

export type UserRole = "member" | "mod" | "admin";

export const profiles = pgTable("profile", {
  userId: text("userId")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("displayName"),
  /** Unique lowercase mention handle, e.g. "rharry". Set at first check in. */
  handle: text("handle").unique(),
  bio: text("bio"),
  role: text("role").$type<UserRole>().default("member").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

/* ----------------------------------------------------- the Saloon (forums) */

export const threads = pgTable(
  "thread",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    board: text("board").notNull(),
    authorId: text("authorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    replyCount: integer("replyCount").default(0).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    lastActivityAt: timestamp("lastActivityAt", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("thread_board_activity_idx").on(t.board, t.lastActivityAt)],
);

export const replies = pgTable(
  "reply",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    threadId: text("threadId")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    authorId: text("authorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("reply_thread_idx").on(t.threadId, t.createdAt)],
);

/* ------------------------------------------------------------ notifications */

export type NotificationKind = "mention" | "reply";

export const notifications = pgTable(
  "notification",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorId: text("actorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").$type<NotificationKind>().notNull(),
    threadId: text("threadId").references(() => threads.id, {
      onDelete: "cascade",
    }),
    snippet: text("snippet").notNull(),
    readAt: timestamp("readAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("notification_user_idx").on(t.userId, t.readAt, t.createdAt)],
);

/* ------------------------------------------------------- the House Board */

export const scores = pgTable(
  "score",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Game slug from lib/site GAMES, or "penny-arcade". */
    game: text("game").notNull(),
    /** The claim, e.g. "Super Helldive clear, zero deaths". */
    label: text("label").notNull(),
    /** Optional number for sortable bests (points, time in seconds, etc.). */
    value: integer("value"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("score_game_idx").on(t.game, t.createdAt)],
);

/* ------------------------------------------------------------- the mail room */

export const conversations = pgTable(
  "conversation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    /** Participant pair stored in sorted order so each pair is unique. */
    userAId: text("userAId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userBId: text("userBId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("lastMessageAt", { mode: "date" })
      .defaultNow()
      .notNull(),
    aLastReadAt: timestamp("aLastReadAt", { mode: "date" }),
    bLastReadAt: timestamp("bLastReadAt", { mode: "date" }),
  },
  (t) => [
    uniqueIndex("conversation_pair_idx").on(t.userAId, t.userBId),
    index("conversation_activity_idx").on(t.lastMessageAt),
  ],
);

export const messages = pgTable(
  "message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    conversationId: text("conversationId")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("senderId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("message_conversation_idx").on(t.conversationId, t.createdAt)],
);
