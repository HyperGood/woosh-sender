import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const referralUserRouter = createTRPCRouter({
  getReferralUserData: protectedProcedure.query(async ({ ctx }) => {
    const referralUser = await ctx.prisma.referralUser.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    return referralUser;
  }),
  createReferralUser: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const referralUser = await ctx.prisma.referralUser.create({
        data: {
          id: ctx.session.user.id,
          phone: input.phone,
          // Instagram username should always be set
          username: ctx.session.user.name as string,
          // TODO: Add image to ReferralUser schema
          // image: ctx.session.user.image,
        },
      });
      return referralUser;
    }),
  // TODO: Add
  deleteReferralUser: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.referralUser.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
