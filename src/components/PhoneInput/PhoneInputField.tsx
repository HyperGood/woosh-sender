import {
  defaultCountries,
  usePhoneInput as useReactInternationalPhone,
} from "react-international-phone";
import PhoneInput from "./PhoneInput";

interface Props {
  value: string | undefined;
  onChange: (phone: string) => void;
}

export default function PhoneInputField({ onChange, value }: Props) {
  const { handlePhoneValueChange, setCountry, ...phoneInputProps } =
    useReactInternationalPhone({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <PhoneInput
      {...phoneInputProps}
      onPhoneInputChange={handlePhoneValueChange}
      onCountryChange={setCountry}
    />
  );
}
