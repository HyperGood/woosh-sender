import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../../Button";
import StepIndicator from "../../Form/StepIndicator";
import DepositButton from "../../DepositVault/DepositButton";
import EnterPhone from "./EnterPhone";
import EnterAmount from "../RHF-EnterAmount";
import ConfirmTransaction from "../ConfirmTransaction";
import ShareTransaction from "../ShareTransaction";
import SignDepositButton from "../../DepositVault/SignDepositButton";
import CloseIcon from "public/images/icons/CloseIcon";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Transaction } from "@prisma/client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PhoneTransactionSchema,
  type PhoneTransaction,
} from "~/models/transactions";

export interface TransactionForm {
  amount: number;
  token: string;
  phone?: string;
  recipient?: string;
  countryCode?: string;
  address?: string;
}
export interface ValidSteps {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
}

export const SendToPhone = () => {
  const [step, setStep] = useState<number>(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    getFieldState,
    reset,
    control,
  } = useForm<PhoneTransaction>({
    resolver: zodResolver(PhoneTransactionSchema),
    mode: "all",
    defaultValues: {
      amount: 0,
      token: "ETH",
      phone: "",
      type: "phone",
    },
  });

  const onSubmit: SubmitHandler<PhoneTransaction> = (data) => {
    console.log(data);
  };

  const [fundsSent, setFundsSent] = useState<boolean>(false);
  const [depositSigned, setDepositSigned] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>("");
  const [nonce, setNonce] = useState<bigint>(BigInt(0));
  const [saveContact, setSaveContact] = useState<CheckedState>(false);
  const [savedTransaction, setSavedTransaction] = useState<Transaction>();

  useEffect(() => {
    if (depositSigned) {
      setStep(3);
    }
  }, [depositSigned]);

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger className="flex items-center justify-center rounded-full bg-brand-gray-light px-8 py-5 text-brand-black transition-colors hover:bg-brand-accent hover:text-brand-black focus:outline-none">
          React Hook Form Version
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Dialog.Content className="fixed left-1/2 top-1/2 h-[695px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-brand-white shadow">
            <Dialog.Close
              onClick={() => {
                if (step === 3) {
                  reset();
                  setDepositSigned(false);
                  setFundsSent(false);
                  setSaveContact(false);
                  setStep(0);
                }
              }}
              className="absolute right-8 top-4 h-6 w-6 hover:text-error"
            >
              <CloseIcon />
            </Dialog.Close>
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                {step === 4 || step === 1 ? null : (
                  <button
                    className="absolute left-8 top-4 mb-4 cursor-pointer self-start opacity-60"
                    onClick={() => setStep(step < 2 ? step : step - 1)}
                  >
                    Back
                  </button>
                )}
                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => {
                      setStep(0);
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={0} name="Phone" currentStep={step} />
                  </button>
                  <button onClick={() => setStep(1)} className="cursor-pointer">
                    <StepIndicator step={1} name="Amount" currentStep={step} />
                  </button>
                  <button onClick={() => setStep(2)} className="cursor-pointer">
                    <StepIndicator step={2} name="Confirm" currentStep={step} />
                  </button>
                  <button onClick={() => setStep(3)} className="cursor-pointer">
                    <StepIndicator step={3} name="Share" currentStep={step} />
                  </button>
                </div>
              </div>
              <form onSubmit={void handleSubmit(onSubmit)}>
                {step === 0 ? (
                  <EnterPhone
                    saveContact={saveContact}
                    setSaveContact={setSaveContact}
                    control={control}
                    register={register}
                  />
                ) : step === 1 ? (
                  <EnterAmount phone={getValues("phone")} register={register} />
                ) : step === 2 ? (
                  <ConfirmTransaction transactionData={getValues()} />
                ) : step === 3 && savedTransaction ? (
                  <ShareTransaction
                    transaction={savedTransaction}
                    secret={secret}
                  />
                ) : (
                  <div>Something went wrong!</div>
                )}
              </form>

              {step === 2 ? (
                fundsSent ? (
                  <SignDepositButton
                    setDepositSigned={setDepositSigned}
                    setSecret={setSecret}
                    transaction={getValues()}
                    nonce={nonce}
                  />
                ) : (
                  <DepositButton
                    transaction={getValues()}
                    setFundsSent={setFundsSent}
                    setNonce={setNonce}
                    nonce={nonce}
                    saveContact={saveContact}
                    setSavedTransaction={setSavedTransaction}
                  />
                )
              ) : step === 3 && savedTransaction ? (
                <Button intent="secondary" fullWidth>
                  Share
                </Button>
              ) : (
                <Button
                  intent="secondary"
                  fullWidth
                  onClick={() => {
                    setStep(step > 3 ? step : step + 1);
                  }}
                  disabled={
                    step === 0
                      ? getFieldState("phone").invalid
                      : saveContact
                      ? getFieldState("contact").invalid
                      : step === 1
                      ? getFieldState("amount").invalid
                      : false
                  }
                >
                  Next
                </Button>
              )}
              <span>{errors.amount?.message}</span>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default SendToPhone;
