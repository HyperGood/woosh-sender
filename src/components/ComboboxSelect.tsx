import { Combobox } from "@headlessui/react";
import Image from "next/image";
import ChevronDownIcon from "public/images/icons/chevron-down";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

export interface Data {
  id: string | number;
  displayValue: string;
  image: string;
  additionalProperties?: unknown;
}

export interface ComboboxProps {
  filteredData: Data[];
  selectedItem: Data;
  setSelectedItem: Dispatch<SetStateAction<Data>>;
  inputOnChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  clickFunction?: () => void;
  useImage?: boolean;
}

const ComboboxSelect = ({
  filteredData,
  selectedItem,
  setSelectedItem,
  inputOnChange,
  clickFunction,
  useImage,
}: ComboboxProps) => {
  return (
    <Combobox value={selectedItem} onChange={setSelectedItem}>
      <div className="relative h-full w-full">
        <Combobox.Button
          as="div"
          className="relative flex  h-full items-center rounded-full bg-brand-white p-2"
        >
          <div className="flex items-center pr-1">
            {useImage && (
              <Image
                src={selectedItem.image}
                alt={selectedItem.displayValue}
                height={24}
                width={24}
              />
            )}
            <Combobox.Input
              displayValue={(item: Data) => item.displayValue}
              onChange={inputOnChange}
              className="h-full w-full bg-transparent pl-2 focus:outline-none"
            />
          </div>
          <div className="absolute right-1 -mt-1 flex h-6 w-6 items-center justify-center">
            <ChevronDownIcon />
          </div>
        </Combobox.Button>
        <Combobox.Options className="absolute z-50 flex max-h-[9rem] w-full flex-col gap-4 overflow-scroll rounded-b-[0.5rem] border bg-white p-2">
          {filteredData?.map((item: Data) => (
            <Combobox.Option
              key={item.id}
              value={item}
              className={({ active }) =>
                `relative cursor-pointer select-none rounded-[.25rem] p-2 ${
                  active ? "bg-brand-accent" : "bg-white"
                }`
              }
              onClick={clickFunction}
            >
              <div className="flex items-center gap-2">
                {useImage && (
                  <Image
                    src={item.image}
                    alt={item.displayValue}
                    height={24}
                    width={24}
                  />
                )}
                {item.displayValue}
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default ComboboxSelect;
