import { z } from "zod";
import validator from "validator";

export const TransactionSchema = z.object({
  amount: z.number().min(0.0000000001).max(1000000),
  token: z.string().min(1).max(5),
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

export const PhoneTransactionSchema = TransactionSchema.extend({
  type: z.literal("phone"),
  phone: z.string().refine((phone) => {
    const formattedPhone = phone.replace(/[-()\s]+/g, "");
    return validator.isMobilePhone(formattedPhone, "any");
  }),
  nonce: z.number().min(0),
});

export type PhoneTransaction = z.infer<typeof PhoneTransactionSchema>;
