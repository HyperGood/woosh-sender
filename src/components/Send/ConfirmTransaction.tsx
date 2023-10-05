import Image from "next/image";
import TransactionInfo from "./TransactionInfo";
import useTokenPrices from "~/hooks/useTokenPrices";
import type { TransactionForm, WalletTransaction } from "~/models/transactions";

export const ConfirmTransaction = ({
  transactionData,
}: {
  transactionData: TransactionForm | WalletTransaction;
}) => {
  const { tokenPrices } = useTokenPrices();
  const tokenPrice =
    transactionData.token === "ETH"
      ? tokenPrices?.["ethereum"].usd
      : tokenPrices?.["usd-coin"].usd;
  const amountInUSD = transactionData.amount * (tokenPrice || 0);

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-2xl">Confirm</h2>
        <p>
          Confirm the transaction and sign the message to generate the secret
          that the recipient will use to claim
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <TransactionInfo
          label="Sending To"
          content={
            <div className="flex items-center gap-4">
              <span className="font-polysans text-lg">
                {transactionData.recipient}
              </span>
            </div>
          }
        />

        <TransactionInfo
          label="Amount"
          content={
            <div className="flex items-center gap-4">
              <Image
                src={`/images/tokens/${transactionData.token}.svg`}
                alt={transactionData.token}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <p className="text-lg">
                {transactionData.amount} {transactionData.token}
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
      </div>
    </div>
  );
};

export default ConfirmTransaction;
