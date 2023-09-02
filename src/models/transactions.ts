import { z } from "zod";
import validator from "validator";
import { formatPhone } from "~/lib/formatPhone";

export const TransactionSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Please enter a number " })
    .min(0.000001, { message: "The amount must be at least 0.000001" })
    .max(1000000),
  token: z.string().min(1).max(20),
  amountInUSD: z.number().min(0),
  txId: z.string(),
  contact: z
    .string()
    .trim()
    .min(2, { message: "Contact name must be 2 or more characters" })
    .max(100)
    .optional(),
  type: z.enum(["wallet", "phone"]),
});

export const WalletTransactionSchema = TransactionSchema.extend({
  type: z.literal("wallet"),
  address: z.string().trim().min(4, {
    message: "This is not long enough to be an ENS name or Ethereum Address",
  }),
});

export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;

export const PhoneTransactionFormSchema = TransactionSchema.extend({
  type: z.literal("phone"),
  phone: z.string().refine(
    (phone) => {
      const formattedPhone = formatPhone(phone);
      return validator.isMobilePhone(formattedPhone, "any");
    },
    { message: "Please enter a phone number that is 10 digits long" }
  ),
  nonce: z.number().min(0),
});

//Phone Transaction Schema for saving to database
export const PhoneTransactionSchema = TransactionSchema.extend({
  type: z.literal("phone"),
  phone: z.string(),
  nonce: z.number().min(0),
});

export type PhoneTransactionForm = z.infer<typeof PhoneTransactionFormSchema>;
export type PhoneTransaction = z.infer<typeof PhoneTransactionSchema>;
