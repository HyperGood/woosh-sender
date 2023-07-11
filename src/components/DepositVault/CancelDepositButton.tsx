import { abi } from "../../lib/contract-abi";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import { despositValutAddressHH } from "~/lib/constants";
import { toast } from "react-hot-toast";
import type { Transaction } from "@prisma/client";
import { useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export const CancelDepositButton = ({
  transaction,
  clicked,
}: {
  transaction: Transaction;
  clicked: boolean;
}) => {
  const ctx = api.useContext();

  const { mutate, isLoading: isRemoving } = api.transaction.remove.useMutation({
    onSuccess: () => {
      console.log("Removed!");
      void ctx.transaction.getTransactionsByUser.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: despositValutAddressHH,
    abi,
    functionName: "withdrawDeposit",
    args: [BigInt(transaction.nonce ? transaction.nonce : 0)],
    enabled: clicked && transaction.type === "phone",
    onError(error) {
      console.log(error);
      toast.error(error.message);
    },
  });

  const {
    data: cancelData,
    write: cancel,
    isLoading: isCancelLoading,
  } = useContractWrite({
    ...contractWriteConfig,
    onError(error) {
      console.log(error);
      toast.error(`Deposit error: ${error.message}`);
    },
  });

  const { isLoading: isCancelling } = useWaitForTransaction({
    hash: cancelData?.hash,
    onSuccess(txData) {
      console.log("txData: ", txData);
      toast.success(`Send cancelled, funds are back in your account!`);
    },
    onError(error) {
      console.log(error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  useEffect(() => {
    if (isCancelling) {
      void mutate({ id: transaction.id });
    }
  }, [isCancelling]);
  return (
    <>
      {isRemoving ? (
        <span>Removing...</span>
      ) : (
        <AlertDialog.Root>
          <AlertDialog.Trigger>Cancel</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
            <AlertDialog.Content className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-brand-white p-8">
              <AlertDialog.Title className="mb-4 font-polysans text-2xl">
                Cancel Send
              </AlertDialog.Title>
              <AlertDialog.Description className="mb-4">
                Are you sure you want to cancel this send?
              </AlertDialog.Description>
              <div className="flex gap-4">
                <AlertDialog.Cancel asChild>
                  <button>Nevermind</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    onClick={() => void cancel?.()}
                    disabled={isCancelLoading || isCancelling}
                    className="rounded-full bg-error/30 px-8 py-3 text-brand-black transition-colors hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCancelLoading ? "Waiting for approval" : "Yes, Cancel"}
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </>
  );
};

export default CancelDepositButton;
