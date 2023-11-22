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
  getReferrer: protectedProcedure.query(async ({ ctx }) => {
    const referralUser = await ctx.prisma.referralUser.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    const referrerId = referralUser?.referrerId;

    const referrerUser = referrerId
      ? await ctx.prisma.referralUser.findFirst({
          where: {
            id: referrerId,
          },
        })
      : null;

    const referrer = referrerUser?.username;

    return referrer ?? null;
  }),
  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const top10 = await ctx.prisma.referralUser.findMany({
      orderBy: {
        referredCount: "desc",
      },
      select: {
        username: true,
        referredCount: true,
      },
      take: 10,
    });

    return top10;
  }),
  createReferralUser: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        referrerUsername: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const referrerUser = await ctx.prisma.referralUser.findFirst({
        where: {
          username: input.referrerUsername,
        },
      });

      const data: {
        id: string;
        phone: string;
        username: string;
        referrerId?: string;
      } = {
        id: ctx.session.user.id,
        phone: input.phone,
        // Instagram username should always be set
        username: ctx.session.user.name as string,
        // TODO: Add image to ReferralUser schema
        // image: ctx.session.user.image,
      };
      if (referrerUser?.id) {
        data.referrerId = referrerUser?.id;
      }

      const referralUser = await ctx.prisma.referralUser.create({ data });
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
