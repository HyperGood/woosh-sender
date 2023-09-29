import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(2).max(40).optional(),
  address: z.string().trim().min(4, {
    message: "This is not long enough to be an ENS name or Ethereum Address",
  }),
  name: z.string().min(1),
  image: z.string().optional(),
});

export type WooshUser = z.infer<typeof UserSchema>;
