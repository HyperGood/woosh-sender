import { abi } from "../../lib/contract-abi";
import { parseEther } from "ethers";
import useDebounce from "~/hooks/useDebounce";
import {
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import { despositValutAddressHH } from "~/lib/constants";
import type { TransactionForm } from "./Send";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import type { Dispatch, SetStateAction } from "react";

export const DepositButton = ({
  transaction,
  setFundsSent,
  setNonce,
}: {
  transaction: TransactionForm;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setNonce: Dispatch<SetStateAction<bigint>>;
}) => {
  const debouncedAmount = useDebounce(transaction.amount, 500);

  const { mutate, isLoading: isSaving } = api.transaction.add.useMutation({
    onSuccess: () => {
      console.log("Saved!");
      void ctx.transaction.getTransactions.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: despositValutAddressHH,
    abi,
    functionName: "deposit",
    value: parseEther(debouncedAmount.toString()),
    enabled: Boolean(debouncedAmount),
    onError(error) {
      console.log(error);
      toast.error(error.message);
    },
  });

  const {
    data: depositData,
    write: deposit,
    isLoading: isDepositLoading,
  } = useContractWrite({
    ...contractWriteConfig,
    onError(error) {
      console.log(error);
      toast.error(`Deposit error: ${error.message}`);
    },
  });

  const { isLoading: isDepositing } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess(txData) {
      console.log("txData: ", txData);
      saveTransaction({ txId: txData.transactionHash });
      setFundsSent(true);
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log(error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  useContractEvent({
    address: despositValutAddressHH,
    abi,
    eventName: "DepositMade",
    listener(log) {
      if (log[0]?.args.depositIndex === undefined) return;
      setNonce(log[0]?.args.depositIndex);
    },
  });

  const ctx = api.useContext();

  const sendFunction = () => {
    if (transaction.phone === "") {
      alert("Please enter a phone number");
    } else if (transaction.amount === 0) {
      alert("Please enter an amount greater than 0");
    } else {
      deposit?.();
    }
  };

  const saveTransaction = ({ txId }: { txId: string }) => {
    if (transaction.amount !== 0 && transaction.phone !== "" && txId) {
      const amountInUSD = transaction.amount * 2000;
      mutate({
        ...transaction,
        amountInUSD: amountInUSD,
        txId: txId,
      });
    } else {
      console.log("Error saving transaction");
    }
  };

  return (
    <>
      {isDepositing && (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      )}

      <button
        onClick={() => void sendFunction()}
        disabled={isSaving || isDepositLoading || isDepositing}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDepositLoading ? "Waiting for approval" : "Send"}
      </button>
    </>
  );
};

export default DepositButton;
