import { z } from "zod";

export const TransactionSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Please enter a number " })
    .min(0.000001, { message: "The amount must be at least 0.000001" })
    .max(1000000),
  token: z.string().min(1).max(20),
  amountInUSD: z.number().min(0),
  txId: z.string(),
  recipient: z.string().trim().nullish(),
});

export const WalletTransactionSchema = TransactionSchema.extend({
  address: z.string().trim().min(4, {
    message: "This is not long enough to be an ENS name or Ethereum Address",
  }),
});

export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;

export const TransactionFormSchema = TransactionSchema.extend({
  depositIndex: z.number().min(0),
});

//Transaction Schema for saving to database
export const VaultTransactionSchema = TransactionSchema.extend({
  depositIndex: z.number().min(0),
  id: z.string(),
});

export type TransactionForm = z.infer<typeof TransactionFormSchema>;
export type Transaction = z.infer<typeof VaultTransactionSchema>;
