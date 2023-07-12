import { TOKENS } from "~/lib/tokens";
import { useState, type Dispatch } from "react";
import type { Data } from "../ComboboxSelect";
import ComboInput from "../ComboInput";
import TransactionInfo from "./TransactionInfo";
import { type UseFormRegister } from "react-hook-form";
import { type PhoneTransaction } from "~/models/transactions";

export const EnterAmount = ({
  register,
  phone,
  contact,
}: {
  register: UseFormRegister<PhoneTransaction>;
  phone: any;
  contact?: any;
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
            {contact ? (
              <>
                {phone ? (
                  <>
                    <span className="font-polysans text-lg">contact</span>
                    <span className="opacity-60">code-{phone}</span>
                  </>
                ) : (
                  <>
                    <span className="font-polysans text-lg">contact</span>
                    <span className="opacity-60">address</span>
                  </>
                )}
              </>
            ) : (
              <>
                {phone ? (
                  <span className="font-polysans text-lg">
                    countryCode-{phone}
                  </span>
                ) : (
                  <span className="font-polysans text-lg">address</span>
                )}
              </>
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
            type="number"
            min={0}
            step={0.01}
            {...register("amount", { valueAsNumber: true })}
          />
        }
      />
    </div>
  );
};

export default EnterAmount;
