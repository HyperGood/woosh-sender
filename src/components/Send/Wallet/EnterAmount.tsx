import { TOKENS, Token } from "~/lib/tokens";
import { Dispatch, SetStateAction, useState } from "react";
import type { Data } from "../../ComboboxSelect";
import ComboInput from "../../ComboInput";
import TransactionInfo from "../TransactionInfo";
import { UseFormSetValue, type UseFormRegister } from "react-hook-form";
import { type WalletTransaction } from "~/models/transactions";
import { useAccount, useBalance } from "wagmi";
import useTokenPrices from "~/hooks/useTokenPrices";

export const EnterAmount = ({
  register,
  contact,
  validateField,
  amountErrorMessage,
  setSelectedToken,
  selectedToken,
  setValue,
  recipient,
}: {
  register: UseFormRegister<WalletTransaction>;
  contact?: string;
  recipient: string;
  validateField: (args0: "amount") => Promise<void>;
  amountErrorMessage?: string;
  setSelectedToken: Dispatch<SetStateAction<Data>>;
  selectedToken: Data;
  setValue: UseFormSetValue<WalletTransaction>;
}) => {
  const [touched, setTouched] = useState<boolean>(false);
  const [amountValue, setAmountValue] = useState(0);
  const { address } = useAccount();
  const [tokenQuery, setTokenQuery] = useState("");
  const selectedTokenData = selectedToken as Token;

  const {
    data: userTokenBalance,
    isError: userTokenBalanceError,
    isLoading: userTokenBalanceLoading,
  } = useBalance({
    address: address,
    token:
      selectedToken.displayValue === "ETH"
        ? undefined
        : selectedTokenData.additionalProperties?.address,
  });
  const { cryptoPrices } = useTokenPrices();
  const tokenPrice =
    selectedToken.displayValue === "ETH"
      ? cryptoPrices?.["ethereum"].usd
      : cryptoPrices?.["usd-coin"].usd;

  const filteredTokens =
    tokenQuery === ""
      ? TOKENS
      : TOKENS.filter((token) => {
          return token.displayValue
            .toLowerCase()
            .includes(tokenQuery.toLowerCase());
        });

  register("amount", {
    valueAsNumber: true,
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
                <span className="break-all opacity-60">{recipient}</span>
              </>
            ) : (
              <>
                <span className="break-all font-polysans text-lg">
                  {recipient}
                </span>
              </>
            )}
          </div>
        }
      />
      <div className="mb-6 mt-10 flex flex-col gap-2">
        <h2 className="text-2xl">How much do you want to send?</h2>
      </div>
      <div className="relative">
        <ComboInput
          label="Amount"
          queryChange={setTokenQuery}
          filteredData={filteredTokens}
          selectedItem={selectedToken}
          setSelectedItem={setSelectedToken}
          input={
            <input
              className="without-ring border-brand-dark ring:border-brand-black w-full rounded-[0.5rem] border-[1px] bg-transparent pb-7 pl-[8.5rem] pr-4 pt-2 text-right text-[1.125rem] focus:border-2 focus:border-brand-black focus:outline-none"
              type="number"
              min={0}
              step={0.001}
              max={Number(userTokenBalance?.formatted) || 100}
              onChange={(e) => {
                setValue("amount", Number(e.target.value));
                setAmountValue(Number(e.target.value));
                void validateField("amount");
                setTouched(true);
              }}
            />
          }
        />
        <span className="absolute bottom-2 right-4 text-sm">
          ${(amountValue * (tokenPrice || 0)).toFixed(2)}
        </span>
      </div>
      {amountErrorMessage && touched ? (
        <span className="mt-2 text-sm text-error">{amountErrorMessage}</span>
      ) : null}
      <div className="flex flex-col">
        <span className="text-right text-[1.125rem] font-bold">
          Remaining balance: $
          {(
            (Number(userTokenBalance?.formatted) - amountValue) *
            (tokenPrice || 1)
          ).toFixed(2)}
        </span>
        <span className="text-right">
          {Number(userTokenBalance?.formatted) - amountValue}
          {selectedToken.displayValue}
        </span>
      </div>
    </div>
  );
};

export default EnterAmount;
