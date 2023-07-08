import { useEffect, useReducer, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../Button";
import StepIndicator from "../Form/StepIndicator";
import DepositButton from "./DepositButton";
import EnterPhone from "./EnterPhone";
import EnterAmount from "./EnterAmount";
import ConfirmTransaction from "./ConfirmTransaction";
import ShareTransaction from "./ShareTransaction";

export interface TransactionForm {
  amount: number;
  token: string;
  phone: string;
  recipient?: string;
  countryCode?: string;
}

export const Send = () => {
  const [step, setStep] = useState<number>(1);
  const [transaction, setFields] = useReducer(
    (
      current: TransactionForm,
      update: Partial<TransactionForm>
    ): TransactionForm => ({
      ...current,
      ...update,
    }),
    {
      amount: 0,
      token: "ETH",
      phone: "",
    }
  );
  const [fundsSent, setFundsSent] = useState<boolean>(false);

  useEffect(() => {
    if (fundsSent) {
      setStep(4);
    }
  }, [fundsSent]);
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger className="flex items-center justify-center rounded-full bg-brand-gray-light px-8 py-5 text-brand-black transition-colors hover:bg-brand-accent hover:text-brand-black focus:outline-none">
          Send To A Phone Number
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Dialog.Content className="fixed left-1/2 top-1/2 h-[695px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-brand-white shadow">
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                {step === 4 ? null : (
                  <button
                    className="mb-4 cursor-pointer self-start opacity-60"
                    onClick={() => setStep(step < 2 ? step : step - 1)}
                  >
                    Back
                  </button>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setStep(1);
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={1} name="Phone" currentStep={step} />
                  </button>
                  <button onClick={() => setStep(2)} className="cursor-pointer">
                    <StepIndicator step={2} name="Amount" currentStep={step} />
                  </button>
                  <button onClick={() => setStep(3)} className="cursor-pointer">
                    <StepIndicator step={3} name="Confirm" currentStep={step} />
                  </button>
                  <button onClick={() => setStep(4)} className="cursor-pointer">
                    <StepIndicator step={4} name="Share" currentStep={step} />
                  </button>
                </div>
              </div>
              <div>
                {step === 1 ? (
                  <EnterPhone transaction={transaction} setFields={setFields} />
                ) : step === 2 ? (
                  <EnterAmount
                    transaction={transaction}
                    setFields={setFields}
                  />
                ) : step === 3 ? (
                  <ConfirmTransaction transaction={transaction} />
                ) : step === 4 ? (
                  <ShareTransaction transaction={transaction} />
                ) : null}
              </div>

              {step === 3 ? (
                <DepositButton
                  transaction={transaction}
                  setFundsSent={setFundsSent}
                />
              ) : (
                <Button
                  intent="secondary"
                  fullWidth
                  onClick={() => {
                    setStep(step > 4 ? step : step + 1);
                    console.log(transaction);
                  }}
                  // disabled={isValid || step > 2 ? false : true}
                >
                  {step === 4 ? "Share" : "Next"}
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
