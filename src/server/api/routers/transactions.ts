import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const transactionsRouter = createTRPCRouter({
  //Get all transactions that belong to the logged in user
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return transactions;
  }),
  //Add a new transaction
  add: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(0).max(1000000),
        token: z.string().min(1).max(5),
        amountInUSD: z.number().min(0),
        phone: z.string().min(10).max(20).optional(),
        txId: z.string(),
        recipient: z.string().min(1).max(100).optional(),
        nonce: z.number().min(0).optional(),
        type: z.enum(["wallet", "phone"]),
        address: z.string().min(1).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const transaction = await ctx.prisma.transaction.create({
        data: {
          amount: input.amount,
          token: input.token,
          amountInUSD: input.amountInUSD,
          phone: input.phone,
          userId: userId,
          txId: input.txId,
          recipient: input.recipient,
          nonce: input.nonce,
          type: input.type,
          address: input.address,
        },
      });
      return transaction;
    }),
  //Remove a transaction
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.delete({
        where: {
          id: input.id,
        },
      });
      return transaction;
    }),
});
