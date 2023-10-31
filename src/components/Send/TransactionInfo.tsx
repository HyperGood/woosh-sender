import { type ReactNode } from "react";

export const TransactionInfo = ({
  label,
  content,
}: {
  label?: string;
  content: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-brand-gray-light px-4 py-6">
      <span>{label}</span>
      {content}
    </div>
  );
};

export default TransactionInfo;
