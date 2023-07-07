import Image from "next/image";
import type { TransactionForm } from "./Send";
import TransactionInfo from "./TransactionInfo";

export const ConfirmTransaction = ({
  transaction,
}: {
  transaction: TransactionForm;
}) => {
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
      </div>
    </div>
  );
};

export default ConfirmTransaction;
