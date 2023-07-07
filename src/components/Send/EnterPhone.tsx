import { PatternFormat } from "react-number-format";
import { COUNTRIES } from "~/lib/countries";
import { useState, type Dispatch, useEffect } from "react";
import type { TransactionForm } from "./Send";
import type { Data } from "../ComboboxSelect";
import ComboInput from "../ComboInput";

export const EnterPhone = ({
  transaction,
  setFields,
}: {
  transaction: TransactionForm;
  setFields: Dispatch<Partial<TransactionForm>>;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Data>(
    COUNTRIES[0] as Data
  );
  const [countryQuery, setCountryQuery] = useState("");
  // const [isValid, setIsValid] = useState<boolean>(false);

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

  // function validatePhoneNumber(number: string) {
  //   const isValidPhoneNumber = validator.isMobilePhone(number, "any", {
  //     strictMode: false,
  //   });
  //   return isValidPhoneNumber;
  // }

  // useEffect(() => {
  //   setIsValid(validatePhoneNumber(transaction.phone.replaceAll(/[()-]/g, "")));
  // }, [transaction.phone, selectedCountry, step]);
  useEffect(() => {
    setFields({ countryCode: selectedCountry.displayValue });
  }, [selectedCountry]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Enter recipient&apos;s phone number</h2>
        <p>
          Your recipient will input this number in order to get access to the
          funds you send them.
        </p>
      </div>
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
                  phone: e.target.value,
                })
              }
              value={transaction.phone}
              placeholder="###-###-####"
            />
          }
        />
        <div className="mt-8 flex flex-col gap-2">
          <label className="text-sm opacity-80">Contact Name</label>
          <input
            type="text"
            value={transaction.recipient}
            onChange={(e) => setFields({ recipient: e.target.value })}
            className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
            placeholder="Enter a name or alias"
          />
        </div>
      </div>
    </div>
  );
};

export default EnterPhone;
