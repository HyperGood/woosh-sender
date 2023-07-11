import Image from "next/image";
import TransactionInfo from "./TransactionInfo";
import CopyIcon from "public/images/icons/CopyIcon";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";
import type { Transaction } from "@prisma/client";

export const ShareTransaction = ({
  transaction,
  countryCode,
  secret,
}: {
  transaction: Transaction;
  secret?: string;
  countryCode?: string;
}) => {
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const amountInUSD = transaction.amount * ethPrice;
  const url = `http://localhost:3000/claim/${transaction.id}`;
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
        <TransactionInfo
          label="Sent To"
          content={
            <div className="flex items-center gap-4">
              {transaction.recipient ? (
                <>
                  {transaction.phone ? (
                    <>
                      <span className="font-polysans text-lg">
                        {transaction.recipient}
                      </span>
                      <span className="opacity-60">
                        {countryCode}-{transaction.phone}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-polysans text-lg">
                        {transaction.recipient}
                      </span>
                      <span className="opacity-60">{transaction.address}</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  {transaction.phone ? (
                    <span className="font-polysans text-lg">
                      {countryCode}-{transaction.phone}
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
        <a href="#" className="underline hover:text-success">
          View transaction on Etherscan
        </a>
      </div>
    </div>
  );
};

export default ShareTransaction;
