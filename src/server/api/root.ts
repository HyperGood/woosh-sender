import { transactionsRouter } from "~/server/api/routers/transactions";
import { contactsRouter } from "./routers/contacts";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transaction: transactionsRouter,
  contact: contactsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
