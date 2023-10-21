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
        <h2 className="text-2xl">
          Share the claim info{" "}
          {transaction.recipient ? `with ${transaction.recipient}` : null}!
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="opacity-60">Sent</span>
          <div className="rounded-2xl bg-brand-accent p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[1.5rem]">
                  {" "}
                  {amountInUSD.toLocaleString("en-us", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                  })}{" "}
                  USD
                </p>{" "}
                <span className="opacity-60">
                  {transaction.amount} {transaction.token}
                </span>
              </div>

              <div className="flex gap-2 rounded-full bg-brand-white py-2 pl-2 pr-4">
                <Image
                  src={`/images/tokens/${transaction.token}.svg`}
                  alt={transaction.token}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                {transaction.token}
              </div>
            </div>
          </div>
        </div>

        {secret ? (
          <div>
            <span className="opacity-60">Secret</span>
            <TransactionInfo
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
          </div>
        ) : null}

        <div>
          <span className="opacity-60">Claim Link</span>
          <TransactionInfo
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
        </div>
      </div>
      <Button
        size="full"
        onClick={() => {
          void navigator.clipboard.writeText(
            `Hey ${
              transaction.recipient ? transaction.recipient : ""
            } I sent you ${transaction.amountInUSD.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            })} with Woosh! 

Claim here ${url}

You'll have to enter this secret ${secret ? secret : "secret"}`
          );
          toast.success("Claim info copied!");
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6">
            <CopyIcon />{" "}
          </div>
          <span>Copy Claim Link & Secret </span>
        </div>
      </Button>
    </div>
  );
};

export default ShareTransaction;
