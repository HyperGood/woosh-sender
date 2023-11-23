import { transactionsRouter } from "~/server/api/routers/transactions";
import { createTRPCRouter } from "~/server/api/trpc";
import { referralUserRouter } from "./routers/referralUsers";
import { userRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transaction: transactionsRouter,
  user: userRouter,
  referralUser: referralUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
