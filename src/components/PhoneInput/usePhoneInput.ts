import { useState } from "react";
import {
  defaultCountries,
  usePhoneInput as useReactInternationalPhone,
} from "react-international-phone";

export default function usePhoneInput() {
  const [phone, setPhone] = useState<string | undefined>();
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    useReactInternationalPhone({
      defaultCountry: "us",
      value: phone,
      countries: defaultCountries,
      onChange: (data) => {
        setPhone(data.phone);
      },
    });

  return {
    inputValue,
    onPhoneInputChange: handlePhoneValueChange,
    inputRef,
    country,
    onCountryChange: setCountry,
  };
}
