import Image from "next/image";
import TransactionInfo from "./TransactionInfo";
import CopyIcon from "public/images/icons/CopyIcon";
import { toast } from "react-hot-toast";
import type { Transaction } from "@prisma/client";
import useTokenPrices from "~/hooks/useTokenPrices";
import { env } from "~/env.mjs";
import Button from "../Button";

export const ShareTransaction = ({
  transaction,
  secret,
}: {
  transaction: Transaction;
  secret?: string;
}) => {
  const { tokenPrices } = useTokenPrices();
  const tokenPrice =
    transaction.token === "ETH"
      ? tokenPrices?.["ethereum"].usd
      : tokenPrices?.["usd-coin"].usd;
  const amountInUSD = transaction.amount * (tokenPrice || 0);
  const url = `https://${env.NEXT_PUBLIC_APP_URL}/claim/${transaction.id}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Share</h2>
        <p>
          Click on copy link and share it with{" "}
          {transaction.recipient ? transaction.recipient : "the recipient"}!
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {/* <TransactionInfo
          label="Sent To"
          content={
            <div className="flex items-center gap-4">
              <>
                <span className="font-polysans text-lg">
                  {transaction.recipient}
                </span>
              </>
            </div>
          }
        /> */}
        <TransactionInfo
          label="Amount"
          content={
            <div className="flex items-center gap-2">
              <Image
                src={`/images/tokens/${transaction.token}.svg`}
                alt={transaction.token}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <p className="text-lg">
                {transaction.amount} {transaction.token}
              </p>{" "}
              <span className="opacity-60">
                {amountInUSD.toLocaleString("en-us", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            </div>
          }
        />
        {secret ? (
          <TransactionInfo
            label="Secret"
            content={
              <div className="flex items-center justify-between gap-4">
                <p className="break-all text-lg ">{secret}</p>
                <div
                  onClick={() => {
                    void navigator.clipboard.writeText(secret);
                    toast.success("Secret copied!");
                  }}
                  className="h-7 w-7 shrink-0 cursor-pointer"
                >
                  <CopyIcon />
                </div>
              </div>
            }
          />
        ) : null}

        <TransactionInfo
          label="Claim Link"
          content={
            <div className="flex items-center justify-between gap-4">
              <p className="break-all text-lg ">{url}</p>
              <div
                onClick={() => {
                  void navigator.clipboard.writeText(url);
                  toast.success("Claim link copied!");
                }}
                className="h-7 w-7 shrink-0 cursor-pointer"
              >
                <CopyIcon />
              </div>
            </div>
          }
        />

        <a
          href={`https://goerli-optimism.etherscan.io/tx/${transaction.txId}`}
          className="underline hover:text-success"
        >
          View transaction on Etherscan
        </a>
      </div>
      <Button
        size="full"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          toast.success("Claim link copied!");
        }}
      >
        Copy Claim Link
      </Button>
    </div>
  );
};

export default ShareTransaction;
