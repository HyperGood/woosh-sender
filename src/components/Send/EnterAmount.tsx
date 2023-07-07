import { TOKENS } from "~/lib/tokens";
import { useState, type Dispatch } from "react";
import type { TransactionForm } from "./Send";
import type { Data } from "../ComboboxSelect";
import ComboInput from "../ComboInput";
import TransactionInfo from "./TransactionInfo";

export const EnterAmount = ({
  transaction,
  setFields,
}: {
  transaction: TransactionForm;
  setFields: Dispatch<Partial<TransactionForm>>;
}) => {
  const [selectedToken, setSelectedToken] = useState<Data>(TOKENS[0] as Data);

  const [tokenQuery, setTokenQuery] = useState("");

  const filteredTokens =
    tokenQuery === ""
      ? TOKENS
      : TOKENS.filter((token) => {
          return token.displayValue
            .toLowerCase()
            .includes(tokenQuery.toLowerCase());
        });

  // useEffect(() => {
  //   setFields({ token: selectedToken.displayValue });
  //   setIsValid(transaction.amount > 0);
  //   console.log(transaction);
  // }, [transaction.amount, selectedToken, step]);

  return (
    <div className="flex flex-col">
      <TransactionInfo
        label="Sending To"
        content={
          <div className="flex items-center gap-4">
            {transaction.recipient ? (
              <>
                <span className="font-polysans text-lg">
                  {transaction.recipient}
                </span>
                <span className="opacity-60">
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
      <div className="mb-6 mt-10 flex flex-col gap-2">
        <h2 className="text-2xl">How much do you want to send?</h2>
      </div>
      <ComboInput
        label="Amount"
        queryChange={setTokenQuery}
        filteredData={filteredTokens}
        selectedItem={selectedToken}
        setSelectedItem={setSelectedToken}
        input={
          <input
            className="without-ring border-brand-dark w-full rounded-[0.5rem] border-[1px] bg-transparent py-4 pl-[8.5rem] pr-4 text-right"
            value={transaction.amount}
            type="number"
            onChange={(e) => setFields({ amount: Number(e.target.value) })}
          />
        }
      />
    </div>
  );
};

export default EnterAmount;
