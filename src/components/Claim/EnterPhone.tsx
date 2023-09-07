import React, {
  type Dispatch,
  type SetStateAction,
  useState,
  Fragment,
  useRef,
  useEffect,
} from "react";
import { type Data } from "../ComboboxSelect";
import { type WooshUser } from "~/models/users";
import { type Control, Controller } from "react-hook-form";

import { COUNTRIES } from "~/lib/countries";
import ComboInput from "../ComboInput";
import { PatternFormat } from "react-number-format";
import { Drawer } from "vaul";
import Button from "../Button";

let currentOTPIndex = 0;

export const EnterPhone = ({
  control,
  selectedCountry,
  setSelectedCountry,
  phoneErrorMessage,
  sendOTP,
  otpSent,
  verifyOTP,
  wrongCode,
}: {
  control: Control<WooshUser>;
  phoneErrorMessage?: string;
  selectedCountry: Data;
  setSelectedCountry: Dispatch<SetStateAction<Data>>;
  sendOTP: () => Promise<void>;
  otpSent: boolean;
  verifyOTP: (args0: string) => Promise<void>;
  wrongCode: boolean;
}) => {
  const [countryQuery, setCountryQuery] = useState("");
  const [touched, setTouched] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);

  const [otp, setOtp] = useState<string>("");
  const [otpFields, setOtpFields] = useState<string[]>(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleOnChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOTP: string[] = [...otpFields];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);
    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);
    setOtpFields(newOTP);
  };

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      setActiveOTPIndex(currentOTPIndex - 1);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    if (wrongCode) {
      setOtp("");
      setOtpFields(new Array(6).fill(""));
      setActiveOTPIndex(0);
      currentOTPIndex = 0;
    }
  }, [wrongCode]);

  useEffect(() => {
    let otpString = "";
    otpFields.map((_) => {
      if (otpString === "") {
        otpString = _;
      } else {
        otpString = otpString + _;
      }
    });
    setOtp(otpString);
  }, [otpFields]);
  return (
    <div className="flex-items flex h-screen flex-col items-center justify-between px-4 py-10">
      <div className="w-full"></div>
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
                    style={{
                      borderColor:
                        phoneErrorMessage && submitClicked
                          ? "red"
                          : "rgb(25 24 29 / 0.2)",
                    }}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    value={value}
                    onBlur={() => setTouched(true)}
                  />
                )}
              />
            }
          />
          {phoneErrorMessage && submitClicked ? (
            <span className="text-sm text-red-500">{phoneErrorMessage}</span>
          ) : null}
        </div>
        <Drawer.Root shouldScaleBackground open={otpSent}>
          <Drawer.Trigger asChild>
            <Button
              intent="accent"
              fullWidth
              disabled={phoneErrorMessage || !touched ? true : false}
              onClick={() => {
                void sendOTP();
                setSubmitClicked(true);
              }}
            >
              Continue
            </Button>
          </Drawer.Trigger>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Portal>
            <Drawer.Content className="fixed bottom-0 left-0 right-0 flex h-full max-h-[92%] flex-col items-center justify-center rounded-t-[10px] bg-gray-100 p-4">
              <div className="flex h-full w-full flex-col items-center justify-end gap-8">
                <div />
                <div className="mb-[22vh] flex  flex-col gap-8 md:mb-0">
                  <h2 className="text-4xl font-bold">
                    Enter the code you received
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    {otpFields.map((_, index) => {
                      return (
                        <Fragment key={index}>
                          <input
                            type="number"
                            ref={index === activeOTPIndex ? inputRef : null}
                            className="h-12 w-12 rounded border-2 border-brand-black/20 bg-transparent p-2 text-center text-xl  outline-none transition focus:border-brand-black/80 focus:text-brand-black"
                            onChange={handleOnChange}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            value={otpFields[index]}
                          />
                        </Fragment>
                      );
                    })}
                  </div>
                  {wrongCode ? (
                    <span className="text-error">Wrong code</span>
                  ) : null}
                </div>
                <Button
                  disabled={otp.length === 6 ? false : true}
                  onClick={() => void verifyOTP(otp)}
                  intent="accent"
                  fullWidth
                >
                  Verify
                </Button>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      <button className="font-bold underline">What is Woosh?</button>
    </div>
  );
};
