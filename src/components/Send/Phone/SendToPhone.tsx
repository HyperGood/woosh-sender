import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../../Button";
import StepIndicator from "../../Form/StepIndicator";
import DepositButton from "../../DepositVault/DepositButton";
import EnterPhone from "./EnterPhone";
import EnterAmount from "./EnterAmount";
import ConfirmTransaction from "../ConfirmTransaction";
import ShareTransaction from "../ShareTransaction";
import SignDepositButton from "../../DepositVault/SignDepositButtonWithSave";
import CloseIcon from "public/images/icons/CloseIcon";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Transaction } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Data } from "../../ComboboxSelect";
import { COUNTRIES, type Country } from "~/lib/countries";
import {
  PhoneTransactionFormSchema,
  type PhoneTransactionForm,
} from "~/models/transactions";

export interface TransactionForm {
  amount: number;
  token: string;
  phone?: string;
  recipient?: string;
  countryCode?: string;
  address?: string;
}

export const SendToPhone = () => {
  const [step, setStep] = useState<number>(0);

  const {
    register,
    formState: { errors },
    getValues,
    reset,
    trigger,
    control,
    resetField,
    setValue,
  } = useForm<PhoneTransactionForm>({
    resolver: zodResolver(PhoneTransactionFormSchema),
    mode: "all",
    defaultValues: {
      amount: 0,
      token: "ETH",
      phone: "",
      type: "phone",
      nonce: 0,
    },
  });

  const [fundsSent, setFundsSent] = useState<boolean>(false);
  const [depositSigned, setDepositSigned] = useState<boolean>(false);
  const [secret, setSecret] = useState<string>("");
  const [saveContact, setSaveContact] = useState<CheckedState>(false);
  const [savedTransaction, setSavedTransaction] = useState<Transaction>();
  const [isValid, setIsValid] = useState<boolean>(false);

  const [selectedCountry, setSelectedCountry] = useState<Data>(
    COUNTRIES[0] as Data
  );

  const validateField = async (input: "phone" | "contact" | "amount") => {
    setIsValid(await trigger(input));
  };

  const handleStepIndicator = async (
    input: "phone" | "contact" | "amount",
    nextStep: number
  ) => {
    if (step === 3) return;
    let validPrev = await trigger(input);
    if (saveContact && step === 0) {
      void validateField("contact");
      if (getValues("contact") === "") return;
      validPrev = isValid;
      if (validPrev === false) return;
    }
    if (validPrev) setStep(nextStep);
  };

  useEffect(() => {
    if (depositSigned) {
      setStep(3);
    }
  }, [depositSigned]);

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger className="flex items-center justify-center rounded-full bg-brand-black px-8 py-5 text-brand-white transition-colors hover:bg-brand-accent hover:text-brand-black focus:outline-none">
          Send To A Phone
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Dialog.Content
            className="fixed bottom-0 left-1/2 min-h-[700px] w-full -translate-x-1/2  rounded-t-xl bg-brand-white shadow lg:top-1/2 lg:w-[640px] lg:-translate-y-1/2 lg:rounded-2xl"
            style={{ height: step === 3 ? "95%" : "80%" }}
          >
            <Dialog.Close
              onClick={() => {
                if (step === 3) {
                  reset();
                  setDepositSigned(false);
                  setFundsSent(false);
                  setSaveContact(false);
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
                {step === 3 ? (
                  <button
                    className="absolute left-8 top-4 mb-4 cursor-pointer self-start opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => {
                      reset();
                      setDepositSigned(false);
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
                    className="absolute left-4 top-4 mb-4 cursor-pointer self-start opacity-60 transition-opacity hover:opacity-100 lg:left-8"
                    onClick={() => setStep(step < 1 ? step : step - 1)}
                  >
                    Back
                  </button>
                )}

                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => {
                      if (step !== 3) {
                        setStep(0);
                        void validateField("phone");
                        if (saveContact) {
                          void validateField("contact");
                        }
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={0} name="Phone" currentStep={step} />
                  </button>
                  <button
                    onClick={() => void handleStepIndicator("phone", 1)}
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
                      if (depositSigned) setStep(3);
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={3} name="Share" currentStep={step} />
                  </button>
                </div>
              </div>
              <form>
                {step === 0 ? (
                  <EnterPhone
                    saveContact={saveContact}
                    setSaveContact={setSaveContact}
                    control={control}
                    register={register}
                    validateField={validateField}
                    phoneErrorMessage={errors.phone?.message}
                    contactErrorMessage={errors.contact?.message}
                    resetContact={() => resetField("contact")}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                  />
                ) : step === 1 ? (
                  <EnterAmount
                    phone={getValues("phone")}
                    register={register}
                    validateField={validateField}
                    amountErrorMessage={errors.amount?.message}
                    countryCode={selectedCountry.displayValue}
                    contact={getValues("contact")}
                  />
                ) : step === 2 ? (
                  <ConfirmTransaction
                    transactionData={getValues()}
                    countryCode={selectedCountry.displayValue}
                  />
                ) : step === 3 && savedTransaction ? (
                  <ShareTransaction
                    transaction={savedTransaction}
                    secret={secret}
                    countryCode={selectedCountry.displayValue}
                  />
                ) : null}
              </form>

              {step === 2 ? (
                fundsSent ? (
                  <SignDepositButton
                    setDepositSigned={setDepositSigned}
                    setSecret={setSecret}
                    transaction={getValues()}
                    setSavedTransaction={setSavedTransaction}
                    countryCode={selectedCountry as Country}
                  />
                ) : (
                  <DepositButton
                    transaction={getValues()}
                    countryCode={selectedCountry as Country}
                    setFundsSent={setFundsSent}
                    saveContact={saveContact}
                    setFormValue={setValue}
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
                  disabled={
                    !isValid ||
                    (saveContact === true && getValues("contact") === undefined)
                  }
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

export default SendToPhone;
