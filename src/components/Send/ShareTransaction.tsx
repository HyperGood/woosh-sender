import Image from "next/image";
import type { TransactionForm } from "./Send";
import TransactionInfo from "./TransactionInfo";
import CopyIcon from "public/images/icons/CopyIcon";
import { toast } from "react-hot-toast";

export const ShareTransaction = ({
  transaction,
  secret,
}: {
  transaction: TransactionForm;
  secret: string;
}) => {
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
          label="Sent to"
          content={
            <div className="flex items-center gap-4">
              {transaction.recipient ? (
                <>
                  <span className="text-lg">{transaction.recipient}</span>
                  <span>
                    {transaction.countryCode}-{transaction.phone}
                  </span>
                </>
              ) : (
                <span className="font-polysans text-lg">
                  {transaction.countryCode}-{transaction.phone}
                </span>
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
              <span className="opacity-60">{transaction.amount} USD</span>
            </div>
          }
        />
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
                className="h-20 w-20 cursor-pointer"
              >
                <CopyIcon />
              </div>
            </div>
          }
        />
        <a href="#" className="underline hover:text-success">
          View transaction on Etherscan
        </a>
      </div>
    </div>
  );
};

export default ShareTransaction;
