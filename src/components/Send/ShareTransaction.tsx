import Image from "next/image";
import TransactionInfo from "./TransactionInfo";
import CopyIcon from "public/images/icons/CopyIcon";
import { toast } from "react-hot-toast";
import type { Transaction } from "@prisma/client";
import { makePhoneReadable } from "~/lib/formatPhone";
import useTokenPrices from "~/hooks/useTokenPrices";
import { env } from "~/env.mjs";

export const ShareTransaction = ({
  transaction,
  countryCode,
  secret,
}: {
  transaction: Transaction;
  secret?: string;
  countryCode?: string;
}) => {
  const { cryptoPrices } = useTokenPrices();
  const tokenPrice =
    transaction.token === "ETH"
      ? cryptoPrices?.["ethereum"].usd
      : cryptoPrices?.["usd-coin"].usd;
  const amountInUSD = transaction.amount * (tokenPrice || 0);
  const url = `${env.NODE_ENV === "development" ? "http" : "https"}://${
    env.NEXTAUTH_URL
  }/claim/${transaction.id}`;
  const formattedPhone = makePhoneReadable(transaction.phone || "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Share</h2>
        <p>
          Click on copy link and share it with{" "}
          {transaction.contact ? transaction.contact : "the recipient"}!
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <TransactionInfo
          label="Sent To"
          content={
            <div className="flex items-center gap-4">
              {transaction.contact ? (
                <>
                  {!transaction.address ? (
                    <>
                      <span className="font-polysans text-lg">
                        {transaction.contact}
                      </span>
                      <span className="opacity-60">
                        {countryCode?.slice(0, 5)}
                        {formattedPhone}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-polysans text-lg">
                        {transaction.contact}
                      </span>
                      <span className="opacity-60">{transaction.address}</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  {!transaction.address ? (
                    <span className="font-polysans text-lg">
                      {countryCode?.slice(0, 5)}
                      {formattedPhone}
                    </span>
                  ) : (
                    <span className="font-polysans text-lg">
                      {transaction.address}
                    </span>
                  )}
                </>
              )}
            </div>
          }
        />
        <TransactionInfo
          label="Amount"
          content={
            <div className="flex items-center gap-4">
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
        {transaction.type === "phone" ? (
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
        ) : null}
        <a
          href={`https://goerli-optimism.etherscan.io/tx/${transaction.txId}`}
          className="underline hover:text-success"
        >
          View transaction on Etherscan
        </a>
      </div>
    </div>
  );
};

export default ShareTransaction;
