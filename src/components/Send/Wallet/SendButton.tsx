import { parseEther } from "ethers";
import useDebounce from "~/hooks/useDebounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import type { TransactionForm } from "../Phone/SendToPhone";
import { toast } from "react-hot-toast";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { LoadingSpinner } from "~/components/Loading";
import type { Transaction } from "@prisma/client";

export const SendButton = ({
  transaction,
  setFundsSent,
  saveContact,
  setSavedTransaction,
}: {
  transaction: TransactionForm;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  saveContact: CheckedState;
}) => {
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const debouncedAmount = useDebounce(transaction.amount, 500);
  const debouncedTo = useDebounce(transaction.address, 500);
  const ctx = api.useContext();

  const { mutate: mutateContact } = api.contact.add.useMutation({
    onSuccess: () => {
      console.log("Successfully added contact");

      void ctx.contact.getContacts.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { mutate } = api.transaction.addWalletTransaction.useMutation({
    onSuccess: (data) => {
      console.log("Saved!");
      setSavedTransaction(data);
      setFundsSent(true);
      void ctx.transaction.getAllTransactionsByUser.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? parseEther(debouncedAmount.toString()) : undefined,
    enabled: debouncedAmount && debouncedTo ? true : false,
  });

  const {
    data: sendData,
    sendTransaction,
    isSuccess: waitingForApproval,
  } = useSendTransaction(config);

  const { isLoading: isSending } = useWaitForTransaction({
    hash: sendData?.hash,
    onSuccess(txData) {
      console.log("txData: ", txData);
      saveTransaction({ txId: txData.transactionHash });
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log(error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  function saveContactFunction() {
    if (transaction.recipient && transaction.address) {
      mutateContact({
        name: transaction.recipient,
        address: transaction.address,
      });
    } else {
      console.log("Error saving contact");
    }
  }

  const sendFunction = () => {
    if (transaction.phone === "") {
      alert("Please enter a phone number");
    } else if (transaction.amount === 0) {
      alert("Please enter an amount greater than 0");
    } else {
      if (saveContact) {
        saveContactFunction();
      }
      sendTransaction?.();
    }
  };

  const saveTransaction = ({ txId }: { txId: string }) => {
    if (transaction.amount !== 0 && transaction.address !== "" && txId) {
      const amountInUSD = transaction.amount * ethPrice;
      mutate({
        ...transaction,
        amountInUSD: amountInUSD,
        txId: txId,
        type: "wallet",
      });
    } else {
      console.log("Error saving transaction");
    }
  };

  return (
    <>
      {isSending && (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      )}

      <button
        onClick={() => void sendFunction()}
        disabled={waitingForApproval || isSending}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {waitingForApproval ? "Waiting for approval" : "Send"}
      </button>
    </>
  );
};

export default SendButton;
