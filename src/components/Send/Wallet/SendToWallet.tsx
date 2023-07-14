import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../../Button";
import StepIndicator from "../../Form/StepIndicator";
import EnterAddress from "./EnterAddress";
import EnterAmount from "../Wallet/EnterAmount";
import ConfirmTransaction from "../ConfirmTransaction";
import ShareTransaction from "../ShareTransaction";
import CloseIcon from "public/images/icons/CloseIcon";
import type { CheckedState } from "@radix-ui/react-checkbox";
import SendButton from "./SendButton";
import type { Transaction } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type WalletTransaction,
  WalletTransactionSchema,
} from "~/models/transactions";

export const SendToWallet = () => {
  const [step, setStep] = useState<number>(0);
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    trigger,
    resetField,
  } = useForm<WalletTransaction>({
    resolver: zodResolver(WalletTransactionSchema),
    mode: "all",
    defaultValues: {
      amount: 0,
      token: "ETH",
      address: "",
      type: "wallet",
    },
  });
  const [fundsSent, setFundsSent] = useState<boolean>(false);
  const [saveContact, setSaveContact] = useState<CheckedState>(false);
  const [savedTransaction, setSavedTransaction] = useState<Transaction>();
  const [isValid, setIsValid] = useState<boolean>();

  const validateField = async (input: "address" | "contact" | "amount") => {
    setIsValid(await trigger(input));
  };

  const handleStepIndicator = async (
    input: "address" | "contact" | "amount",
    nextStep: number
  ) => {
    if (step === 3) return;
    const validPrev = await trigger(input);
    if (validPrev) setStep(nextStep);
  };

  useEffect(() => {
    if (fundsSent) {
      setStep(3);
    }
  }, [fundsSent]);

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger className="flex items-center justify-center rounded-full bg-brand-gray-light px-8 py-5 text-brand-black transition-colors hover:bg-brand-accent hover:text-brand-black focus:outline-none">
          Send To An ETH Address
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 min-h-[700px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-brand-white shadow"
            style={{ height: step === 3 ? "100%" : "80%" }}
          >
            <Dialog.Close
              onClick={() => {
                if (step === 3) {
                  reset();
                  setFundsSent(false);
                  setSaveContact(false);
                  setIsValid(false);
                  setStep(0);
                }
              }}
              className="absolute right-8 top-4 h-6 w-6 transition-colors hover:text-error"
            >
              <CloseIcon />
            </Dialog.Close>
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                {step === 3 ? (
                  <button
                    className="absolute left-8 top-4 mb-4 cursor-pointer self-start opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => {
                      reset();
                      setFundsSent(false);
                      setSaveContact(false);
                      setIsValid(false);
                      setStep(0);
                    }}
                  >
                    Make a new send
                  </button>
                ) : step === 0 ? null : (
                  <button
                    className="absolute left-8 top-4 mb-4 cursor-pointer self-start opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => setStep(step < 1 ? step : step - 1)}
                  >
                    Back
                  </button>
                )}
                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => {
                      if (step !== 3) setStep(0);
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={0} name="Address" currentStep={step} />
                  </button>
                  <button
                    onClick={() => void handleStepIndicator("address", 1)}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={1} name="Amount" currentStep={step} />
                  </button>
                  <button
                    onClick={() => void handleStepIndicator("amount", 2)}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={2} name="Confirm" currentStep={step} />
                  </button>
                  <button
                    onClick={() => {
                      if (fundsSent) setStep(3);
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={3} name="Share" currentStep={step} />
                  </button>
                </div>
              </div>
              <form>
                {step === 0 ? (
                  <EnterAddress
                    register={register}
                    saveContact={saveContact}
                    setSaveContact={setSaveContact}
                    validateField={validateField}
                    addressErrorMessage={errors.address?.message}
                    contactErrorMessage={errors.contact?.message}
                    resetContact={() => resetField("contact")}
                  />
                ) : step === 1 ? (
                  <EnterAmount
                    contact={getValues("contact")}
                    register={register}
                    validateField={validateField}
                    amountErrorMessage={errors.amount?.message}
                    address={getValues("address")}
                  />
                ) : step === 2 ? (
                  <ConfirmTransaction transactionData={getValues()} />
                ) : step === 3 && savedTransaction ? (
                  <ShareTransaction transaction={savedTransaction} />
                ) : null}
              </form>

              {step === 2 ? (
                <SendButton
                  transaction={getValues()}
                  setFundsSent={setFundsSent}
                  saveContact={saveContact}
                  setSavedTransaction={setSavedTransaction}
                />
              ) : step === 3 && savedTransaction ? (
                <Button intent="secondary" fullWidth>
                  Share
                </Button>
              ) : (
                <Button
                  intent="secondary"
                  fullWidth
                  disabled={
                    !isValid ||
                    (saveContact === true && getValues("contact") === undefined)
                  }
                  onClick={() => {
                    console.log(getValues());
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

export default SendToWallet;
