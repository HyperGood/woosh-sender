import type { ReactNode } from "react";
import ComboboxSelect from "./ComboboxSelect";
import type { ComboboxProps } from "./ComboboxSelect";

export interface ComboInputProps extends ComboboxProps {
  label?: string;
  errorMesage?: string;
  required?: boolean;
  queryChange: (args0: string) => void;
  input: ReactNode;
}

const ComboInput = ({
  label,
  errorMesage,
  required = false,
  filteredData,
  selectedItem,
  setSelectedItem,
  queryChange,
  input,
  clickFunction,
}: ComboInputProps) => {
  return (
    <div className="flex w-full flex-col">
      {label && (
        <label className="mb-2 text-sm opacity-80">
          {required ? label + "*" : label}
        </label>
      )}
      <div className="relative">
        <div className="absolute h-full w-[8rem] p-[1px]">
          <ComboboxSelect
            filteredData={filteredData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            inputOnChange={(e) => queryChange(e.target.value)}
            clickFunction={clickFunction}
          />
        </div>
        {input}
      </div>

      <span className="text-sm text-red-500">{errorMesage}</span>
    </div>
  );
};

export default ComboInput;
