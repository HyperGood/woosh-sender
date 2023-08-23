import { type Dispatch, type SetStateAction, useState } from "react";
import { type Data } from "../ComboboxSelect";
import { type WooshUser } from "~/models/users";
import { type Control, Controller } from "react-hook-form";
import { type VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { type VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import { COUNTRIES } from "~/lib/countries";
import Header from "../Header";
import ComboInput from "../ComboInput";
import { PatternFormat } from "react-number-format";
import { Drawer } from "vaul";
import Button from "../Button";

export const EnterPhone = ({
  control,
  validateField,
  selectedCountry,
  setSelectedCountry,
  phoneErrorMessage,
  setOtpVerified,
  phoneValue,
}: {
  phoneValue: string;
  control: Control<WooshUser>;
  validateField: (args0: "username" | "phone") => Promise<void>;
  phoneErrorMessage?: string;
  selectedCountry: Data;
  setSelectedCountry: Dispatch<SetStateAction<Data>>;
  setOtpVerified: Dispatch<SetStateAction<boolean>>;
}) => {
  const [countryQuery, setCountryQuery] = useState("");
  const [touched, setTouched] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [otp, setOtp] = useState<string>("");

  async function sendOTP() {
    if (phoneValue) {
      const res = await fetch("/api/sms/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneValue }),
      });
      await res.json().then((data: { verification: VerificationInstance }) => {
        if (data.verification.status === "pending") {
          setOtpSent(true);
        } else if (data.verification.status === "approved") {
          setOtpVerified(true);
        } else {
          setOtpSent(false);
          setOtpVerified(false);
        }
      });
    } else {
      console.error("No phone number provided");
    }
  }

  async function verifyOTP() {
    const res = await fetch("/api/sms/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otpCode: otp }),
    });
    await res
      .json()
      .then((data: { verification_check: VerificationCheckInstance }) => {
        if (data.verification_check.status === "approved") {
          setOtpVerified(true);
        }
      });
  }

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
        <Drawer.Root shouldScaleBackground open={otpSent}>
          <Drawer.Trigger asChild>
            <Button
              intent="accent"
              fullWidth
              disabled={phoneErrorMessage || !touched ? true : false}
              onClick={() => void sendOTP()}
            >
              Continue
            </Button>
          </Drawer.Trigger>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Portal>
            <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[96%] flex-col items-center justify-center rounded-t-[10px] bg-gray-100 p-4">
              <div className="flex w-full flex-col gap-8">
                <div className="mb-2 flex flex-col gap-2">
                  <h2 className="text-4xl font-bold">
                    Enter the code you received
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    type="number"
                    maxLength={6}
                    className="rounded-full border border-brand-black/20 bg-transparent p-4"
                    placeholder="Enter code"
                  />
                </div>
              </div>
              <Button
                disabled={otp.length === 6 ? false : true}
                onClick={() => void verifyOTP()}
                intent="accent"
                fullWidth
              >
                Verify
              </Button>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      <button className="font-bold underline">What is Woosh?</button>
    </div>
  );
};
