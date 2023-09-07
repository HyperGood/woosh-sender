import { z } from "zod";
import validator from "validator";
import { formatPhone } from "~/lib/formatPhone";

/*
  id          String        @id @default(cuid())
  name        String?
  username  String?       @unique
  address     String        @unique
  phone      String?        @unique
  image       String?
  accounts    Account[]
  sessions    Session[]
  Transactions Transaction[]
  Contacts     Contact[]
*/

export const UserSchema = z.object({
  username: z.string().min(2).max(40).optional(),
  address: z.string().trim().min(4, {
    message: "This is not long enough to be an ENS name or Ethereum Address",
  }),
  name: z.string().min(1),
  phone: z
    .string()
    .refine(
      (phone) => {
        const formattedPhone = formatPhone(phone);
        return validator.isMobilePhone(formattedPhone, "any");
      },
      { message: "Please enter a phone number that is 10 digits long" }
    )
    .optional(),
  image: z.string().optional(),
});

export type WooshUser = z.infer<typeof UserSchema>;
