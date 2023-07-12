import { type PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  PhoneTransactionSchema,
  WalletTransactionSchema,
} from "~/models/transactions";

export async function getAllPhoneTransactions({
  prisma,
}: {
  prisma: PrismaClient;
}) {
  const transactions = await prisma.transaction.findMany({
    where: {
      type: "phone",
    },
  });
  return transactions;
}

export async function getTransactionById({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: { id: string };
}) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: input.id,
    },
  });
  return transaction;
}

export const transactionsRouter = createTRPCRouter({
  //Get all transactions that belong to the logged in user
  getAllTransactionsByUser: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return transactions;
  }),

  //Add a new transaction
  addPhoneTransaction: protectedProcedure
    .input(PhoneTransactionSchema)
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
          contact: input.contact,
          nonce: input.nonce,
          type: input.type,
        },
      });
      return transaction;
    }),
  addWalletTransaction: protectedProcedure
    .input(WalletTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const transaction = await ctx.prisma.transaction.create({
        data: {
          amount: input.amount,
          token: input.token,
          amountInUSD: input.amountInUSD,
          address: input.address,
          userId: userId,
          txId: input.txId,
          contact: input.contact,
          type: input.type,
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
  //Update transaction status
  updateClaimedStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        claimed: z.boolean(),
        claimedAt: z.date(),
        claimedBy: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          claimed: input.claimed,
          claimedAt: input.claimedAt,
          claimedBy: input.claimedBy,
        },
      });
      return transaction;
    }),
});
