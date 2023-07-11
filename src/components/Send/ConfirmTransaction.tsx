import Image from "next/image";
import type { TransactionForm } from "./Phone/SendToPhone";
import TransactionInfo from "./TransactionInfo";
import { useContext } from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";

export const ConfirmTransaction = ({
  transaction,
}: {
  transaction: TransactionForm;
}) => {
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const amountInUSD = transaction.amount * ethPrice;

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
              {transaction.recipient ? (
                <>
                  {transaction.phone ? (
                    <>
                      <span className="font-polysans text-lg">
                        {transaction.recipient}
                      </span>
                      <span className="opacity-60">
                        {transaction.countryCode}-{transaction.phone}
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
                      {transaction.countryCode}-{transaction.phone}
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
      </div>
    </div>
  );
};

export default ConfirmTransaction;
