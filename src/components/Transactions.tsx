import SignDepositButton from "~/components/DepositVault/SignDepositButton";
import { makePhoneReadable } from "~/lib/formatPhone";
import * as Dialog from "@radix-ui/react-dialog";
import TransactionInfo from "~/components/Send/TransactionInfo";
import { toast } from "react-hot-toast";
import CopyIcon from "public/static/images/icons/CopyIcon";
import Button from "~/components/Button";
import CancelDepositButton from "~/components/DepositVault/CancelDepositButton";
import { api } from "~/utils/api";
import type { Transaction } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { type PhoneTransaction } from "~/models/transactions";
import { env } from "~/env.mjs";

export const TransactionCard = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const [clicked, setClicked] = useState(false);
  const [secret, setSecret] = useState("");
  const phone = makePhoneReadable(transaction.phone || "");
  const url = `https://${env.NEXT_PUBLIC_APP_URL}/claim/${transaction.id}`;
  const [open, setOpen] = useState(false);
  const SecretDialog = () => (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col gap-4 rounded-t-xl bg-brand-white px-4 py-8 shadow lg:bottom-auto lg:top-1/2 lg:w-[640px] lg:-translate-y-1/2 lg:rounded-2xl">
          <Dialog.Title className="text-2xl">Transaction Secret</Dialog.Title>
          <TransactionInfo
            label="Claim Link"
            content={
              <div className="flex items-center justify-between gap-4">
                <p className="break-all text-lg ">{url}</p>
                <div
                  onClick={() => {
                    void navigator.clipboard.writeText(url);
                    toast.success("Claim link copied!");
                  }}
                  className="h-7 w-7 shrink-0 cursor-pointer"
                >
                  <CopyIcon />
                </div>
              </div>
            }
          />
          <TransactionInfo
            label="Secret"
            content={
              <div className="flex items-center justify-between gap-4">
                <p className="break-all text-lg ">{secret}</p>
                <div
                  onClick={() => {
                    void navigator.clipboard.writeText(secret);
                    toast.success("Secret copied!");
                  }}
                  className="h-7 w-7 shrink-0 cursor-pointer"
                >
                  <CopyIcon />
                </div>
              </div>
            }
          />

          <Dialog.Close asChild>
            <div className="mt-4">
              <Button fullWidth intent="secondary">
                Close
              </Button>
            </div>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  useEffect(() => {
    if (secret) {
      setOpen(true);
    }
  }, [secret]);

  return (
    <div className="flex w-full flex-col rounded-md bg-[#F1F3F2] px-4 py-5 text-brand-black">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {transaction.contact ? (
              <>
                <span className="font-polysans">{transaction.contact}</span>
                <span className="break-all opacity-60">
                  {!transaction.address ? phone : transaction.address}
                </span>
              </>
            ) : (
              <span className="break-all font-polysans">
                {!transaction.address ? phone : transaction.address}
              </span>
            )}
          </div>
          {transaction.type === "phone" ? (
            <span className="opacity-60">
              {transaction.claimed ? "Claimed" : "Unclaimed"}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="font-polysans">
            {transaction.amount} {transaction.token}
          </div>
          <span className="opacity-60">
            {transaction.amountInUSD.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
      </div>
      {transaction.type === "phone" ? (
        <div className="mt-6 flex w-full items-center justify-between">
          {transaction.claimed ? null : (
            <div
              onClick={() => {
                setClicked(!clicked);
              }}
            >
              <CancelDepositButton
                transaction={transaction as PhoneTransaction}
                clicked={clicked}
              />
            </div>
          )}
          {!transaction.claimed ? (
            <div
              onClick={() => {
                if (secret && !open) setOpen(true);
              }}
              className="opacity-80 hover:opacity-100"
            >
              <SignDepositButton
                transaction={transaction as PhoneTransaction}
                setSecret={setSecret}
                secret={secret}
                card
              />
            </div>
          ) : null}
        </div>
      ) : null}
      <SecretDialog />
    </div>
  );
};

export const PreviousSends = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.transaction.getAllTransactionsByUser.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) return <div>Oh no, something went horribly wrong!😟</div>;

  return (
    <>
      <div className="h-full w-full">
        <p className="mb-5 font-polysans text-lg ">
          previous sends ({data.length})
        </p>
        {data.length !== 0 ? (
          <div className=" flex h-full w-full flex-col gap-5 overflow-auto pb-20">
            {data.map((transaction: Transaction) => (
              <div key={transaction.id} className="w-full">
                <TransactionCard transaction={transaction} />
              </div>
            ))}
            {data.length > 6 && (
              <span className="mt-2 text-center opacity-60">
                That&apos;s all of them!
              </span>
            )}
          </div>
        ) : (
          <span className="opacity-60">
            Once you send funds the transaction details will be here!
          </span>
        )}
      </div>
    </>
  );
};
