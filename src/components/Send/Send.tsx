import { type ReactNode, useReducer, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../Button";
import { motion } from "framer-motion";
import { COUNTRIES } from "~/lib/countries";
import { TOKENS } from "~/lib/tokens";
import type { Data } from "../ComboboxSelect";
import { PatternFormat } from "react-number-format";
import ComboInput from "../ComboInput";
import DepositButton from "./DepositButton";
import validator from "validator";

export interface TransactionForm {
  amount: number;
  token: string;
  phone: string;
  recipient?: string;
}

const CheckIcon = () => {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.2,
        }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        d="M1 6L6 11L16 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StepIndicator = ({
  step,
  currentStep,
}: {
  step: number;
  currentStep: number;
}) => {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div
      animate={status}
      transition={{ duration: 0.25 }}
      initial={false}
      variants={{
        inactive: {
          borderColor: "var(--brand-black)",
          color: "var(--brand-black)",
          scale: 1,
          opacity: 0.4,
        },
        active: {
          borderColor: "var(--brand-accent)",
          color: "var(--brand-black)",
          scale: 1.1,
          opacity: 1,
        },
        complete: {
          borderColor: "var(--brand-black)",
          color: "var(--brand-white)",
          scale: 1,
          opacity: 1,
        },
      }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-transparent`}
    >
      <motion.div
        animate={status}
        transition={{ type: "spring" }}
        initial={{ scale: 0, backgroundColor: "var(--brand-black)" }}
        variants={{
          inactive: {
            backgroundColor: "var(--brand-white)",
            scale: 0,
          },
          active: {
            backgroundColor: "var(--brand-accent)",
            scale: 1,
          },
          complete: {
            backgroundColor: "var(--brand-black)",
            scale: 1,
          },
        }}
        className="absolute h-full w-full rounded-full"
      ></motion.div>
      <div className="relative">
        {status === "complete" ? (
          <CheckIcon />
        ) : (
          <span className="leading-none">{step}</span>
        )}
      </div>
    </motion.div>
  );
};

const Step = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </div>
  );
};
export const Send = () => {
  const [step, setStep] = useState<number>(1);
  const [isValid, setIsValid] = useState<boolean>(false);
  //Dropdown State & Filters
  const [selectedCountry, setSelectedCountry] = useState<Data>(
    COUNTRIES[0] as Data
  );
  const [selectedToken, setSelectedToken] = useState<Data>(TOKENS[0] as Data);
  const [countryQuery, setCountryQuery] = useState("");
  const [tokenQuery, setTokenQuery] = useState("");

  const filteredCountries =
    countryQuery === ""
      ? COUNTRIES
      : COUNTRIES.filter((country) => {
          return (
            country.additionalProperties.name
              .toLowerCase()
              .includes(countryQuery.toLowerCase()) ||
            country.additionalProperties.code.includes(countryQuery) ||
            country.additionalProperties.abbr
              .toLowerCase()
              .includes(countryQuery.toLowerCase())
          );
        });

  const filteredTokens =
    tokenQuery === ""
      ? TOKENS
      : TOKENS.filter((token) => {
          return token.displayValue
            .toLowerCase()
            .includes(tokenQuery.toLowerCase());
        });

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

  function validatePhoneNumber(number: string) {
    const isValidPhoneNumber = validator.isMobilePhone(number, "any", {
      strictMode: false,
    });
    return isValidPhoneNumber;
  }

  useEffect(() => {
    setIsValid(validatePhoneNumber(transaction.phone));
  }, [transaction.phone, selectedCountry, step]);

  useEffect(() => {
    setIsValid(transaction.amount > 0);
  }, [transaction.amount, selectedToken, step]);

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger className="flex items-center justify-center rounded-full bg-brand-gray-light px-8 py-5 text-brand-black transition-colors hover:bg-brand-accent hover:text-brand-black focus:outline-none">
          Send To A Phone Number
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Dialog.Content className="fixed left-1/2 top-1/2 h-[695px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-brand-white shadow">
            <div className="flex h-full flex-col justify-between p-8">
              <div>
                <button
                  className="mb-4 cursor-pointer self-start opacity-60"
                  onClick={() => setStep(step < 2 ? step : step - 1)}
                >
                  Back
                </button>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setStep(1);
                      setIsValid(validatePhoneNumber(transaction.phone));
                    }}
                    className="cursor-pointer"
                  >
                    <StepIndicator step={1} currentStep={step} />
                  </button>
                  <button onClick={() => setStep(2)} className="cursor-pointer">
                    <StepIndicator step={2} currentStep={step} />
                  </button>
                  <button onClick={() => setStep(3)} className="cursor-pointer">
                    <StepIndicator step={3} currentStep={step} />
                  </button>
                  <button onClick={() => setStep(4)} className="cursor-pointer">
                    <StepIndicator step={4} currentStep={step} />
                  </button>
                </div>
              </div>
              <div>
                {step === 1 ? (
                  <Step
                    title="Enter recipient's phone number "
                    description="Your recipient will input this number in order to get access to the funds you send them."
                  >
                    <div className="flex flex-col">
                      <ComboInput
                        filteredData={filteredCountries}
                        selectedItem={selectedCountry}
                        setSelectedItem={setSelectedCountry}
                        queryChange={setCountryQuery}
                        label="Recipient Phone Number"
                        required
                        input={
                          <PatternFormat
                            className="w-full rounded-[0.5rem] border-[1px] border-brand-black bg-transparent py-3 pl-[8.75rem] pr-2 focus:border-2 focus:outline-none"
                            format="(###)-###-####"
                            mask="_"
                            onChange={(e) =>
                              setFields({
                                phone: e.target.value.replaceAll(/[()-]/g, ""),
                              })
                            }
                            value={transaction.phone}
                            placeholder="###-###-####"
                          />
                        }
                      />
                      <div className="mt-8 flex flex-col gap-2">
                        <label className="text-sm opacity-80">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={transaction.recipient}
                          onChange={(e) =>
                            setFields({ recipient: e.target.value })
                          }
                          className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
                          placeholder="Enter a name or alias"
                        />
                      </div>
                    </div>
                  </Step>
                ) : step === 2 ? (
                  <Step title="How much do you want to send?">
                    <ComboInput
                      label="Amount"
                      queryChange={setTokenQuery}
                      filteredData={filteredTokens}
                      selectedItem={selectedToken}
                      setSelectedItem={setSelectedToken}
                      input={
                        <input
                          className="without-ring border-brand-dark w-full rounded-[0.5rem] border-[1px] bg-transparent py-4 pl-[8.5rem] pr-4 text-right"
                          value={transaction.amount || 0}
                          min={0}
                          type="number"
                          onChange={(e) =>
                            setFields({ amount: Number(e.target.value) })
                          }
                        />
                      }
                    />
                  </Step>
                ) : step === 3 ? (
                  <Step
                    title="Confirm"
                    description="Your recipient will input this in order to get access to the funds you send them."
                  >
                    <div>Confirmation page</div>
                  </Step>
                ) : step === 4 ? (
                  <Step title="Share">
                    <div>Share page</div>
                  </Step>
                ) : null}
              </div>

              {step === 4 ? (
                <DepositButton transaction={transaction} />
              ) : (
                <Button
                  intent="secondary"
                  fullWidth
                  onClick={() => {
                    setStep(step > 4 ? step : step + 1);
                    setIsValid(false);
                  }}
                  disabled={isValid || step > 2 ? false : true}
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
