import Image from "next/image";
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="opacity-60">Sending</span>
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
                {transactionData.amount} {transactionData.token}
              </span>
            </div>

            <div className="flex gap-2 rounded-full bg-brand-white py-2 pl-2 pr-4">
              <Image
                src={`/images/tokens/${transactionData.token}.svg`}
                alt={transactionData.token}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              {transactionData.token}
            </div>
          </div>
        </div>
      </div>

      {transactionData.recipient ? (
        <div className="flex flex-col gap-2">
          <span className="opacity-60">To</span>
          <div className="rounded-2xl bg-brand-gray-light px-4 py-6 ">
            <p className="text-[1.25rem]">{transactionData.recipient}</p>{" "}
          </div>
        </div>
      ) : null}

      <div className="flex w-full items-center justify-between">
        <span>Fee</span>
        <span className="font-polysans font-bold">FREE</span>
      </div>
    </div>
  );
};

export default ConfirmTransaction;
