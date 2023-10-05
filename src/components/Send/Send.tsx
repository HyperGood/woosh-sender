import { useEffect, useState } from "react";
import { TOKENS } from "~/lib/tokens";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../Button";
import StepIndicator from "../Form/StepIndicator";
import DepositButton from "../DepositVault/DepositButton";
import EnterAmount from "./EnterAmount";
import ConfirmTransaction from "./ConfirmTransaction";
import ShareTransaction from "./ShareTransaction";
import SignDepositButton from "~/components/DepositVault/SignDepositButtonWithSave";
import CloseIcon from "public/images/icons/CloseIcon";
import type { Transaction } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Data } from "../ComboboxSelect";
import {
  TransactionFormSchema,
  type TransactionForm,
} from "~/models/transactions";
import SendIcon from "public/images/icons/SendIcon";

// export interface TransactionForm {
//   amount: number;
//   token: string;
//   recipient?: string;
//   address?: string;
// }

export const Send = () => {
  const [step, setStep] = useState<number>(0);

  const {
    register,
    formState: { errors },
    getValues,
    reset,
    trigger,
    setValue,
  } = useForm<TransactionForm>({
    resolver: zodResolver(TransactionFormSchema),
    mode: "all",
    defaultValues: {
      amount: 0,
      token: "ETH",
      depositIndex: 0,
    },
  });

  const [fundsSent, setFundsSent] = useState<boolean>(false);
  const [depositSigned, setDepositSigned] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>("");
  const [savedTransaction, setSavedTransaction] = useState<Transaction>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Data>(TOKENS[0] as Data);

  const validateField = async (input: "recipient" | "amount") => {
    setIsValid(await trigger(input));
  };

  const handleStepIndicator = async (
    input: "recipient" | "amount",
    nextStep: number
  ) => {
    if (step === 2) return;
    let validPrev = await trigger(input);

    void validateField("recipient");
    if (getValues("recipient") === "") return;
    validPrev = isValid;
    if (validPrev === false) return;

    if (validPrev) setStep(nextStep);
  };

  useEffect(() => {
    if (depositSigned) {
      setStep(2);
    }
  }, [depositSigned]);

  useEffect(() => {
    if (selectedToken) {
      setValue("token", selectedToken.displayValue);
    }
  }, [setValue, selectedToken]);

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>
            <div className="flex items-center gap-2">
              <SendIcon />
              <span>Send</span>
            </div>
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Dialog.Content className="fixed bottom-0 left-1/2 h-[98vh] w-full  -translate-x-1/2 rounded-t-xl bg-brand-white lg:top-1/2 lg:w-[640px] lg:-translate-y-1/2 lg:rounded-2xl">
            <Dialog.Close
              onClick={() => {
                if (step === 2) {
                  reset();
                  setDepositSigned(false);
                  setFundsSent(false);
                  setIsValid(false);
                  setStep(0);
                }
              }}
              className="absolute right-4 top-4 h-6 w-6 transition-colors hover:text-error lg:right-8"
            >
              <CloseIcon />
            </Dialog.Close>
            <div className="flex h-full flex-col justify-between p-4 lg:p-8">
              <div>
                {step === 2 ? (
                  <button
                    className="absolute left-8 top-4 mb-4 cursor-pointer self-start opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => {
                      reset();
                      setDepositSigned(false);
                      setFundsSent(false);
                      setIsValid(false);
                      setStep(0);
                    }}
                  >
                    Make a new send
                  </button>
                ) : step === 0 ? null : (
                  <button
                    className="absolute left-4 top-4 mb-4 cursor-pointer self-start opacity-60 transition-opacity hover:opacity-100 lg:left-8"
                    onClick={() => setStep(step < 1 ? step : step - 1)}
                  >
                    Back
                  </button>
                )}

                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => {
                      if (step !== 2) {
                        setStep(0);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={0} name="Amount" currentStep={step} />
                  </button>
                  <button
                    onClick={() => void handleStepIndicator("amount", 2)}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={1} name="Confirm" currentStep={step} />
                  </button>
                  <button
                    onClick={() => {
                      if (depositSigned) setStep(2);
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={2} name="Share" currentStep={step} />
                  </button>
                </div>
              </div>
              <form>
                {step === 0 ? (
                  <EnterAmount
                    register={register}
                    validateField={validateField}
                    amountErrorMessage={errors.amount?.message}
                    setSelectedToken={setSelectedToken}
                    selectedToken={selectedToken}
                    setValue={setValue}
                  />
                ) : step === 1 ? (
                  <ConfirmTransaction transactionData={getValues()} />
                ) : step === 2 && savedTransaction ? (
                  <ShareTransaction
                    transaction={savedTransaction}
                    secret={secret}
                  />
                ) : null}
              </form>

              {step === 1 ? (
                fundsSent ? (
                  <SignDepositButton
                    setDepositSigned={setDepositSigned}
                    setSecret={setSecret}
                    transaction={getValues()}
                    setSavedTransaction={setSavedTransaction}
                  />
                ) : (
                  <DepositButton
                    transaction={getValues()}
                    setFundsSent={setFundsSent}
                    setFormValue={setValue}
                  />
                )
              ) : step === 2 && savedTransaction ? null : (
                <Button
                  size="full"
                  disabled={!isValid}
                  onClick={() => {
                    if (isValid) {
                      setStep(step > 3 ? step : step + 1);
                      const amount = getValues("amount");
                      if (amount === 0) setIsValid(false);
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default Send;
