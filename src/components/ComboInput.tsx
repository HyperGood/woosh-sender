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
  required = false,
  filteredData,
  selectedItem,
  setSelectedItem,
  queryChange,
  input,
  clickFunction,
  useImage,
}: ComboInputProps) => {
  return (
    <div className="flex w-full flex-col">
      {label && (
        <label className="mb-2 text-sm opacity-80">
          {required ? label + "*" : label}
        </label>
      )}
      <div className="relative flex items-center justify-between rounded-2xl bg-brand-accent px-4">
        {input}
        <div>
          <ComboboxSelect
            filteredData={filteredData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            inputOnChange={(e) => queryChange(e.target.value)}
            clickFunction={clickFunction}
            useImage={useImage}
          />
        </div>
      </div>
    </div>
  );
};

export default ComboInput;
