import { Combobox } from "@headlessui/react";
import ChevronDownIcon from "public/images/icons/chevron-down";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

export interface Data {
  id: string | number;
  displayValue: string;
  additionalProperties?: unknown;
}

export interface ComboboxProps {
  filteredData: Data[];
  selectedItem: Data;
  setSelectedItem: Dispatch<SetStateAction<Data>>;
  inputOnChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  clickFunction?: () => void;
}

const ComboboxSelect = ({
  filteredData,
  selectedItem,
  setSelectedItem,
  inputOnChange,
  clickFunction,
}: ComboboxProps) => {
  return (
    <Combobox value={selectedItem} onChange={setSelectedItem}>
      <div className="relative h-full w-full">
        <Combobox.Button
          as="div"
          className="relative flex  h-full items-center"
        >
          <Combobox.Input
            displayValue={(item: Data) => item.displayValue}
            onChange={inputOnChange}
            className="h-full w-full bg-transparent px-4 focus:outline-none"
          />
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
              {item.displayValue}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default ComboboxSelect;
