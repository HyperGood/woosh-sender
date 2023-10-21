import { TOKENS, type Token } from "~/lib/tokens";
import { type Dispatch, type SetStateAction, useState } from "react";
import ComboInput from "../ComboInput";
import { type UseFormSetValue, type UseFormRegister } from "react-hook-form";
import { type TransactionForm } from "~/models/transactions";
import { type Data } from "~/components/ComboboxSelect";
import { useAccount, useBalance } from "wagmi";
import useTokenPrices from "~/hooks/useTokenPrices";

/*

To-do

  - Switch between token amount and entering amount in dollars
  - Change comboinput to select
  - When clicking back the previous inputted amount should show

*/

export const EnterAmount = ({
  register,
  validateField,
  amountErrorMessage,
  setSelectedToken,
  selectedToken,
  setValue,
}: {
  register: UseFormRegister<TransactionForm>;
  validateField: (args0: "amount") => Promise<void>;
  amountErrorMessage?: string;
  setSelectedToken: Dispatch<SetStateAction<Data>>;
  selectedToken: Data;
  setValue: UseFormSetValue<TransactionForm>;
}) => {
  //selected token
  //token balance
  //send amount (usd or token val)
  //display send amount
  const [touched, setTouched] = useState<boolean>(false);
  const [tokenQuery, setTokenQuery] = useState("");
  const [amountValue, setAmountValue] = useState(0);
  const { address } = useAccount();
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
  const { tokenPrices } = useTokenPrices();
  const tokenPrice =
    selectedToken.displayValue === "ETH"
      ? tokenPrices?.["ethereum"].usd
      : tokenPrices?.["usd-coin"].usd;

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
    <div className="flex flex-col gap-8">
      {/* <div className="mb-6 mt-10 flex flex-col gap-2">
        <h2 className="text-2xl">How much do you want to send?</h2>
      </div> */}

      <div>
        <div className="relative mb-3">
          <ComboInput
            label="Send"
            queryChange={setTokenQuery}
            filteredData={filteredTokens}
            selectedItem={selectedToken}
            setSelectedItem={setSelectedToken}
            useImage={true}
            input={
              <input
                className="without-ring ring:border-brand-black w-full rounded-[0.5rem] border-none bg-transparent pb-10 pt-4 text-[1.5rem] focus:border-2 focus:border-brand-black focus:outline-none"
                type="number"
                min={0}
                step={0.01}
                max={Number(userTokenBalance?.formatted) || 100}
                placeholder="0"
                onChange={(e) => {
                  setValue("amount", Number(e.target.value));
                  setAmountValue(Number(e.target.value));
                  void validateField("amount");
                  setTouched(true);
                }}
              />
            }
          />
          <span className="absolute bottom-4 left-4 ">
            ${(amountValue * (tokenPrice || 0)).toFixed(2)}
          </span>
        </div>
        <div>
          {amountErrorMessage && touched ? (
            <span className="mt-2 text-sm text-error">
              {amountErrorMessage}
            </span>
          ) : null}
          {userTokenBalanceLoading ? (
            <span
              className="inline-block h-5 w-full animate-pulse rounded-sm bg-brand-gray-medium "
              style={{ animationDelay: "0.05s", animationDuration: "1s" }}
            />
          ) : userTokenBalanceError ? (
            <span className="text-sm text-error">
              Error getting your balance, please reload the page
            </span>
          ) : (
            <div className="flex items-center gap-4">
              <span>
                Balance: $
                {(
                  Number(userTokenBalance?.formatted) * (tokenPrice || 1)
                ).toFixed(2)}
              </span>
              <div className="h-[1.5rem] w-[1px] bg-brand-black opacity-20" />
              <span>
                {`${Number(userTokenBalance?.formatted)} ${
                  selectedToken.displayValue
                }`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="mb-2 text-sm opacity-80">To</label>
        <input
          className="without-ring ring:border-brand-black w-full rounded-2xl border-none bg-brand-gray-light px-4 py-6 text-[1.125rem] focus:border-2 focus:border-brand-black focus:outline-none"
          {...register("recipient")}
          placeholder="Enter recipient name"
        />
      </div>
    </div>
  );
};

export default EnterAmount;
