import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const accessRequestRouter = createTRPCRouter({
  createAccessRequest: publicProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const accessRequest = await ctx.prisma.accessRequest.create({
        data: {
          phone: input.phone,
        },
      });
      return accessRequest;
    }),

  getAccessRequest: publicProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.accessRequest.findUnique({
        where: {
          phone: input.phone,
        },
      });
      return user;
    }),
});
