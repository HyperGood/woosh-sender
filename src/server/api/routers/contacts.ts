import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contactsRouter = createTRPCRouter({
  //Get all transactions that belong to the logged in user
  getContacts: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.contact.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return transactions;
  }),
  // //Add a new transaction
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const contact = await ctx.prisma.contact.create({
        data: {
          name: input.name,
          address: input.address,
          phone: input.phone,
          userId: userId,
        },
      });
      return contact;
    }),
  //When working with contacts figure out a way to save recent recipients and optionally add them as contacts
});
