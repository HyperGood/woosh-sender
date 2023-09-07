import { abi } from "../../lib/DepositVaultABI";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import { contractAddress, type Addresses } from "../../lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "../Button";
import type { PhoneTransaction } from "~/models/transactions";

export const CancelDepositButton = ({
  transaction,
  clicked,
}: {
  transaction: PhoneTransaction;
  clicked: boolean;
}) => {
  const ctx = api.useContext();
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";
  const { mutate, isLoading: isRemoving } = api.transaction.remove.useMutation({
    onSuccess: () => {
      console.log("Removed!");
      void ctx.transaction.getAllTransactionsByUser.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: depositVaultAddress,
    abi,
    functionName: "withdrawDeposit",
    args: [BigInt(transaction.depositIndex ? transaction.depositIndex : 0)],
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
      if (error.message.includes("User rejected the request")) {
        toast.error("Don't worry no funds were sent.");
        toast.error(
          "It looks like you rejected the transaction in your wallet. Try again and accept the transaction."
        );
      } else {
        console.log("There was an error depositing the funds ", error);
        toast.error(`Deposit error: ${error.message}`);
      }
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
  }, [isCancelling, mutate, transaction.id]);
  return (
    <>
      {isRemoving ? (
        <span>Removing...</span>
      ) : (
        <AlertDialog.Root>
          <AlertDialog.Trigger className="text-brand-black/60 transition-colors hover:text-error">
            Cancel Transaction
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
            <AlertDialog.Content className="fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col gap-4 rounded-t-xl bg-brand-white px-4 py-8 shadow lg:bottom-auto lg:top-1/2 lg:w-[640px] lg:-translate-y-1/2 lg:rounded-2xl">
              <AlertDialog.Title className="mb-4 font-polysans text-2xl">
                Cancel Send
              </AlertDialog.Title>
              <AlertDialog.Description className="mb-4">
                Are you sure you want to cancel this send?
              </AlertDialog.Description>
              <div className="flex w-full justify-between gap-4">
                <AlertDialog.Cancel asChild>
                  <Button intent="primary">Nevermind</Button>
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
