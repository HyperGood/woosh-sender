import { type ReactNode } from "react";

export const TransactionInfo = ({
  label,
  content,
}: {
  label: string;
  content: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-brand-gray-light px-5 py-2">
      <span>{label}</span>
      {content}
    </div>
  );
};

export default TransactionInfo;
