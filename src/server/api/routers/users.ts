import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { type PrismaClient } from "@prisma/client";

export async function getUserById({
  prisma,
  input,
}: {
  prisma: PrismaClient;
  input: { id: string };
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
  });
  return user;
}

export const userRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string().optional(),
        phone: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
      return user;
    }),
});
