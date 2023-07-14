import { PatternFormat } from "react-number-format";
import { COUNTRIES } from "~/lib/countries";
import { useState, type Dispatch, useEffect, type SetStateAction } from "react";

import ComboInput from "../../ComboInput";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useAnimate } from "framer-motion";
import {
  type Control,
  Controller,
  type UseFormRegister,
} from "react-hook-form";
import { type PhoneTransactionForm } from "~/models/transactions";
import type { Data } from "~/components/ComboboxSelect";

export const EnterPhone = ({
  saveContact,
  setSaveContact,
  control,
  register,
  validateField,
  phoneErrorMessage,
  contactErrorMessage,
  resetContact,
  selectedCountry,
  setSelectedCountry,
}: {
  saveContact: Checkbox.CheckedState;
  setSaveContact: Dispatch<SetStateAction<Checkbox.CheckedState>>;
  control: Control<PhoneTransactionForm>;
  register: UseFormRegister<PhoneTransactionForm>;
  validateField: (args0: "phone" | "contact") => Promise<void>;
  phoneErrorMessage?: string;
  contactErrorMessage?: string;
  resetContact: () => void;
  selectedCountry: Data;
  setSelectedCountry: Dispatch<SetStateAction<Data>>;
}) => {
  const [touched, setTouched] = useState<boolean>(false);
  const [countryQuery, setCountryQuery] = useState("");

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

  const [ref, animate] = useAnimate();

  useEffect(() => {
    if (saveContact) {
      void animate(ref.current, { backgroundColor: "var(--brand-accent)" });
      void animate(".indicator", { scale: 1 }, { type: "spring" });
    } else {
      void animate(ref.current, { backgroundColor: "var(--brand-gray-light)" });
      void animate(".indicator", { scale: 0 });
      resetContact();
      void validateField("phone");
    }
  }, [saveContact]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Enter recipient&apos;s phone number</h2>
        <p>
          Your recipient will input this number in order to get access to the
          funds you send them.
        </p>
      </div>
      <div className="flex w-full flex-col items-start">
        <ComboInput
          filteredData={filteredCountries}
          selectedItem={selectedCountry}
          setSelectedItem={setSelectedCountry}
          queryChange={setCountryQuery}
          label="Recipient Phone Number"
          input={
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <PatternFormat
                  format={`(###) ###-####`}
                  mask="_"
                  placeholder={`(___) ___-____`}
                  className="w-full rounded-[0.5rem] border-[1px] border-brand-black bg-transparent py-3 pl-[8.75rem] pr-2 focus:border-2 focus:outline-none"
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
        {phoneErrorMessage && touched ? (
          <span className="mt-2 text-sm text-error">{phoneErrorMessage}</span>
        ) : null}

        <Checkbox.Root
          checked={saveContact}
          onCheckedChange={setSaveContact}
          className="my-6 flex cursor-pointer items-center gap-2"
        >
          <div
            ref={ref}
            className="flex h-6 w-6  items-center justify-center rounded-[0.25rem] border border-brand-black/10 transition-colors"
          >
            <Checkbox.Indicator forceMount>
              <div className="indicator h-2 w-2 rounded-sm bg-brand-black"></div>
            </Checkbox.Indicator>
          </div>
          <span>Save as contact</span>
        </Checkbox.Root>

        {saveContact ? (
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm opacity-80">Contact Name</label>
            <input
              type="text"
              {...register("contact", {
                onChange: () => {
                  if (saveContact) void validateField("contact");
                },
              })}
              className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
              placeholder="Enter a name or alias"
            />
            {contactErrorMessage ? (
              <span className="mt-2 text-sm text-error">
                {contactErrorMessage}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EnterPhone;
