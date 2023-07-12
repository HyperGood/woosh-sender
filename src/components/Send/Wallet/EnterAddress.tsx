import { type Dispatch, useEffect, type SetStateAction } from "react";
import type { TransactionForm } from "../Phone/SendToPhone";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useAnimate } from "framer-motion";

export const EnterAddress = ({
  transaction,
  setFields,
  saveContact,
  setSaveContact,
}: {
  transaction: TransactionForm;
  setFields: Dispatch<Partial<TransactionForm>>;
  saveContact: Checkbox.CheckedState;
  setSaveContact: Dispatch<SetStateAction<Checkbox.CheckedState>>;
}) => {
  // const [isValid, setIsValid] = useState<boolean>(false);

  const [ref, animate] = useAnimate();

  useEffect(() => {
    if (saveContact) {
      void animate(ref.current, { backgroundColor: "var(--brand-accent)" });
      void animate("div", { scale: 1 }, { type: "spring" });
    } else {
      void animate(ref.current, { backgroundColor: "var(--brand-gray-light)" });
      void animate("div", { scale: 0 });
    }
  }, [saveContact]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Enter a Ethereum Address or ENS name</h2>
      </div>
      <div className="flex flex-col items-start">
        <div className="flex w-full flex-col gap-2">
          <label className="text-sm opacity-80">Ethereum Address or ENS</label>
          <input
            type="text"
            value={transaction.address}
            onChange={(e) => setFields({ address: e.target.value })}
            className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
            placeholder="Enter Ethereum address or ENS"
          />
        </div>
        <div
          className="my-6 flex cursor-pointer items-center gap-2"
          onClick={() => setSaveContact(!saveContact)}
        >
          <Checkbox.Root
            checked={saveContact}
            onCheckedChange={setSaveContact}
            ref={ref}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.25rem] border border-brand-black/10 transition-colors"
          >
            <Checkbox.Indicator forceMount>
              <div className="h-2 w-2 rounded-sm bg-brand-black"></div>
            </Checkbox.Indicator>
          </Checkbox.Root>

          <span>Save as contact</span>
        </div>
        {saveContact ? (
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm opacity-80">Contact Name</label>
            <input
              type="text"
              value={transaction.recipient}
              onChange={(e) => setFields({ recipient: e.target.value })}
              className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
              placeholder="Enter a name or alias"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EnterAddress;
