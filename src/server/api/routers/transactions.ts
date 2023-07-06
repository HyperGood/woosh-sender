import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const transactionsRouter = createTRPCRouter({
  //Get all transactions that belong to the logged in user
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    console.log(ctx.session.user.id);
    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return transactions;
  }),
  // //Add a new transaction
  // add: protectedProcedure.input(z.object{

  // })
});
