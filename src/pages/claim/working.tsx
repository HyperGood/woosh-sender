import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type Control, Controller, useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import Button from "~/components/Button";
import ComboInput from "~/components/ComboInput";
import { type Data } from "~/components/ComboboxSelect";
import StepIndicator from "~/components/Form/StepIndicator";
import Header from "~/components/header";
// import { env } from "~/env.mjs";
import { COUNTRIES } from "~/lib/countries";
import { UserSchema, type WooshUser } from "~/models/users";
// import twilio from "twilio";

const Intro = ({
  control,
  validateField,
  selectedCountry,
  setSelectedCountry,
  phoneErrorMessage,
}: {
  control: Control<WooshUser>;
  validateField: (args0: "username" | "phone") => Promise<void>;
  phoneErrorMessage?: string;
  selectedCountry: Data;
  setSelectedCountry: Dispatch<SetStateAction<Data>>;
}) => {
  const [countryQuery, setCountryQuery] = useState("");
  const [touched, setTouched] = useState<boolean>(false);

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

  return (
    <div className="flex-items flex h-screen flex-col items-center justify-between px-4 py-10">
      <div className="w-full">
        <Header noAccountButton />
      </div>
      <div className="-mt-10">
        <h1 className="mb-3 text-3xl">
          Looks like someone sent you crypto! 🤑
        </h1>
        <p className="text-lg">Enter your phone number to claim it!</p>
        <div className="mb-10 mt-6 flex flex-col items-center gap-2">
          <ComboInput
            filteredData={filteredCountries}
            selectedItem={selectedCountry}
            setSelectedItem={setSelectedCountry}
            queryChange={setCountryQuery}
            input={
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <PatternFormat
                    format={`(###) ###-####`}
                    mask="_"
                    placeholder={`(000)-000-0000`}
                    className="w-full rounded-full border-[1px] border-brand-black/20 bg-transparent py-4 pl-[8.75rem] pr-2 focus:border-2 focus:outline-none"
                    onChange={(e) => {
                      onChange(e.target.value);
                      void validateField("phone");
                    }}
                    value={value}
                    onBlur={() => setTouched(true)}
                  />
                )}
              />
            }
          />

          <span className="text-sm">
            We&apos;ll send a code to verify via SMS
          </span>
        </div>
        <Button
          intent="accent"
          fullWidth
          disabled={phoneErrorMessage || !touched ? true : false}
        >
          Continue
        </Button>
      </div>
      <button className="font-bold underline">What is Woosh?</button>
    </div>
  );
};

const Onboarding = () => {
  return (
    <div>
      <StepIndicator step={0} currentStep={0} name="" />
      <div>
        <span>Usually takes about 45 seconds</span>
        <h2>Create an account</h2>
        <p>This is where your funds will be stored!</p>
        <Button intent="secondary" fullWidth>
          Get Started
        </Button>
      </div>
      <button className="font-bold underline">What is Woosh?</button>
    </div>
  );
};

const Claim = () => {
  return (
    <div>
      <div>
        <h2>Claim your $50 that John sent you!</h2>
        <p>Enter the secret the sender sent you</p>
        <Button intent="accent" fullWidth>
          Claim
        </Button>
      </div>
      <button className="font-bold underline">
        I don&apos;t have a secret code
      </button>
    </div>
  );
};

export default function Working() {
  const [step, setStep] = useState(0);
  const [isValid, setIsValid] = useState<boolean>(false);
  //   const accountSid = env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
  //   const token = env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
  //   const verifySid = "VA0119e70fd4af9ec3b0a8bc4903868f4d";
  //   const client = twilio(accountSid, token);

  const {
    register,
    formState: { errors },
    getValues,
    reset,
    trigger,
    control,
    resetField,
    setValue,
  } = useForm<WooshUser>({
    resolver: zodResolver(UserSchema),
    mode: "all",
    defaultValues: {
      phone: "",
      username: "",
      address: "",
      image: "",
    },
  });

  const [selectedCountry, setSelectedCountry] = useState<Data>(
    COUNTRIES[0] as Data
  );

  const validateField = async (input: "username" | "phone") => {
    setIsValid(await trigger(input));
  };

  //Find a transaction with that phone number
  //If there is one, trigger SMS verification
  //   function verifyPhone(){

  //   }
  //If the SMS verification is successful, show onboarding
  //If there isn't one, show a popup

  //Execute claim

  //SIWE & Save user data to DB

  useEffect(() => {
    if (step === 4) {
      //Go to the dashboard
    }
  }, [step]);

  return (
    <>
      {step === 0 ? (
        <Intro
          control={control}
          validateField={validateField}
          phoneErrorMessage={errors.phone?.message}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      ) : step === 1 ? (
        <Onboarding />
      ) : step === 2 ? (
        <Claim />
      ) : null}
    </>
  );
}
