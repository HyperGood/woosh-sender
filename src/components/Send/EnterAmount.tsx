import { TOKENS, type Token } from "~/lib/tokens";
import { type Dispatch, type SetStateAction, useState } from "react";
import ComboInput from "../ComboInput";
import { type UseFormSetValue, type UseFormRegister } from "react-hook-form";
import { type TransactionForm } from "~/models/transactions";
import { type Data } from "~/components/ComboboxSelect";
import { useAccount, useBalance } from "wagmi";
import useTokenPrices from "~/hooks/useTokenPrices";

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
        <div className="mb-6 mt-10 flex flex-col gap-2">
          <h2 className="text-2xl">Send funds using a link</h2>
          <p>
            The recipient doesn&apos;t need to have a wallet or be a Woosh user
            to recieve the funds!
          </p>
        </div>
        <div className="relative">
          <ComboInput
            label="Send"
            queryChange={setTokenQuery}
            filteredData={filteredTokens}
            selectedItem={selectedToken}
            setSelectedItem={setSelectedToken}
            useImage={true}
            input={
              <input
                className="without-ring border-brand-dark ring:border-brand-black w-full rounded-[0.5rem] border-[1px] bg-transparent pb-7 pl-[8.5rem] pr-4 pt-2 text-right text-[1.125rem] focus:border-2 focus:border-brand-black focus:outline-none"
                type="number"
                min={0}
                step={0.01}
                max={Number(userTokenBalance?.formatted) || 100}
                // value={amountValue}
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
          <span className="absolute bottom-2 right-4 text-sm">
            ${(amountValue * (tokenPrice || 0)).toFixed(2)}
          </span>
        </div>
        <div>
          {amountErrorMessage && touched ? (
            <span className="mt-2 text-sm text-error">
              {amountErrorMessage}
            </span>
          ) : null}
          <div className="my-4 h-[1px] w-full bg-brand-black/10" />
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
          )}
        </div>
      </div>
      <div>
        <label className="mb-2 text-sm opacity-80">Sending to</label>
        <input
          className="without-ring border-brand-dark ring:border-brand-black w-full rounded-[0.5rem] border-[1px] bg-transparent p-4 text-[1.125rem] focus:border-2 focus:border-brand-black focus:outline-none"
          // value={amountValue}
          placeholder="Enter recipient name"
        />
      </div>
    </div>
  );
};

export default EnterAmount;
