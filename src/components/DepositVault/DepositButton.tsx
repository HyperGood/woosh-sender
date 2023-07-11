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
import type { TransactionForm } from "../Send/Phone/SendToPhone";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import {
  useContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Transaction } from "@prisma/client";

export const DepositButton = ({
  transaction,
  setFundsSent,
  setNonce,
  nonce,
  saveContact,
  setSavedTransaction,
}: {
  transaction: TransactionForm;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setNonce: Dispatch<SetStateAction<bigint>>;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  nonce: bigint;
  saveContact: CheckedState;
}) => {
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const debouncedAmount = useDebounce(transaction.amount, 500);
  const ctx = api.useContext();
  const [innerNonce, setInnerNonce] = useState<bigint>();

  const { mutate: mutateContact } = api.contact.add.useMutation({
    onSuccess: () => {
      console.log("Successfully added contact");
      void ctx.contact.getContacts.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { mutate, isLoading: isSaving } = api.transaction.add.useMutation({
    onSuccess: (data) => {
      console.log("Saved!");
      setSavedTransaction(data);
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
      // console.log(log);
      // console.log(log[0]?.args.depositIndex);
      // if (log[0]?.args.depositIndex === undefined) return;
      if (log[0]?.args.depositIndex) {
        setNonce(log[0]?.args.depositIndex);
        setInnerNonce(log[0]?.args.depositIndex);
        console.log(nonce);
      }
      // console.log(nonce);
    },
  });

  function saveContactFunction() {
    if (transaction.recipient && transaction.phone) {
      mutateContact({
        name: transaction.recipient,
        phone: transaction.phone,
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
      deposit?.();
    }
  };

  const saveTransaction = ({ txId }: { txId: string }) => {
    if (transaction.amount !== 0 && transaction.phone !== "" && txId) {
      const amountInUSD = transaction.amount * ethPrice;
      mutate({
        ...transaction,
        amountInUSD: amountInUSD,
        txId: txId,
        nonce: Number(innerNonce),
        type: "phone",
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
