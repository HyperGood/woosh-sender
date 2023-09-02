import { TOKENS } from "~/lib/tokens";
import { type Dispatch, type SetStateAction, useState } from "react";
import ComboInput from "../../ComboInput";
import TransactionInfo from "../TransactionInfo";
import { type UseFormRegister } from "react-hook-form";
import { type PhoneTransaction } from "~/models/transactions";
import { type Data } from "~/components/ComboboxSelect";

export const EnterAmount = ({
  register,
  phone,
  contact,
  validateField,
  amountErrorMessage,
  countryCode,
  setSelectedToken,
  selectedToken,
}: {
  register: UseFormRegister<PhoneTransaction>;
  phone: string;
  contact?: string;
  validateField: (args0: "amount") => Promise<void>;
  amountErrorMessage?: string;
  countryCode: string;
  setSelectedToken: Dispatch<SetStateAction<Data>>;
  selectedToken: Data;
}) => {
  const [touched, setTouched] = useState<boolean>(false);

  const [tokenQuery, setTokenQuery] = useState("");

  const filteredTokens =
    tokenQuery === ""
      ? TOKENS
      : TOKENS.filter((token) => {
          return token.displayValue
            .toLowerCase()
            .includes(tokenQuery.toLowerCase());
        });

  return (
    <div className="flex flex-col">
      <TransactionInfo
        label="Sending To"
        content={
          <div className="flex items-center gap-4">
            {contact ? (
              <>
                <span className="font-polysans text-lg">{contact}</span>
                <span className="opacity-60">
                  {countryCode}-{phone}
                </span>
              </>
            ) : (
              <>
                <span className="font-polysans text-lg">
                  {countryCode}-{phone}
                </span>
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
            {...register("amount", {
              valueAsNumber: true,
              onChange: () => {
                void validateField("amount");
                setTouched(true);
              },
            })}
          />
        }
      />
      {amountErrorMessage && touched ? (
        <span className="mt-2 text-sm text-error">{amountErrorMessage}</span>
      ) : null}
    </div>
  );
};

export default EnterAmount;
