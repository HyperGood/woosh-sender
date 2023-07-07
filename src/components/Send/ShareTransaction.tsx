import type { TransactionForm } from "./Send";

export const ShareTransaction = ({
  transaction,
}: {
  transaction: TransactionForm;
}) => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Share</h2>
      </div>
      <p>
        I sent you {transaction.amount} {transaction.token} to{" "}
        {transaction.phone}
      </p>
    </div>
  );
};

export default ShareTransaction;
