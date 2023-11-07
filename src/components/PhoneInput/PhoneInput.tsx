import { Listbox } from "@headlessui/react";
import PixelChevron from "public/images/icons/pixel-chevron";
import {
  FlagImage,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import { cn } from "~/utils/cn";
import type usePhoneInput from "./usePhoneInput";

export default function PhoneInput({
  country,
  inputRef,
  inputValue,
  onCountryChange,
  onPhoneInputChange,
}: ReturnType<typeof usePhoneInput>) {
  return (
    <div className="flex flex-grow items-center justify-between gap-2">
      <Listbox value={country.iso2} onChange={onCountryChange}>
        <Listbox.Button className="flex h-[4.6875rem] items-center justify-center gap-1 rounded-2xl bg-brand-gray-light px-3">
          {({ open }) => (
            <>
              <FlagImage iso2={country.iso2} className="h-6" />
              <PixelChevron
                className={cn(
                  "h-5 w-5 rotate-90 transform",
                  open ? "-rotate-90" : ""
                )}
              />
            </>
          )}
        </Listbox.Button>
        <Listbox.Options className="text-base absolute top-10 z-50 max-h-36 w-72 overflow-auto rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {defaultCountries.map((c) => {
            const country = parseCountry(c);

            return (
              <Listbox.Option key={country.iso2} value={country.iso2}>
                {({ active, selected }) => (
                  <div
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 p-2",
                      active ? "bg-brand-gray-light" : ""
                    )}
                  >
                    <div className="flex items-center justify-start gap-2">
                      {selected ? (
                        <div className="h-2 w-2 rounded-full bg-brand-main" />
                      ) : (
                        ""
                      )}
                      <FlagImage iso2={country.iso2} className="h-5" />
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {country.name}
                      </p>
                    </div>
                    <p>{`+${country.dialCode}`}</p>
                  </div>
                )}
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
      </Listbox>
      <input
        className="h-[4.6875rem] flex-grow rounded-2xl bg-brand-gray-light px-4 text-[1.3125rem] font-medium leading-5"
        type="tel"
        value={inputValue}
        onChange={onPhoneInputChange}
        ref={inputRef}
      />
    </div>
  );
}
