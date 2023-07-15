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
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import {
  useContext,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Transaction } from "@prisma/client";
import type { PhoneTransactionForm } from "~/models/transactions";
import { type Country } from "~/lib/countries";
import { formatPhone } from "~/lib/formatPhone";
import { type UseFormSetValue } from "react-hook-form";

export const DepositButton = ({
  transaction,
  setFundsSent,
  setNonce,
  saveContact,
  setSavedTransaction,
  countryCode,
}: {
  transaction: PhoneTransactionForm;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setNonce: UseFormSetValue<PhoneTransactionForm>;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  saveContact: CheckedState;
  countryCode: Country;
}) => {
  // const [transaction, setTransaction] = useState(getTransaction());
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const debouncedAmount = useDebounce(transaction.amount, 500);
  const ctx = api.useContext();
  const [nonceIn, setNonceIn] = useState<bigint>();

  const { mutate: mutateContact } = api.contact.add.useMutation({
    onSuccess: () => {
      toast.success("Contact saved!");
      void ctx.contact.getContacts.invalidate();
    },
    onError: (error) => {
      console.log("There was an error saving the contact", error);
    },
  });
  const {
    mutate,
    isLoading: isSaving,
    isError: errorSavingTransaction,
  } = api.transaction.addPhoneTransaction.useMutation({
    onSuccess: (data) => {
      setSavedTransaction(data);
      setFundsSent(true);
      void ctx.transaction.getAllTransactionsByUser.invalidate();
    },
    onError: (error) => {
      console.log("There was an error saving the transaction ", error);
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
      console.log("There was an error depositing the funds ", error);
      toast.error(`Deposit error: ${error.message}`);
    },
  });

  const {
    isLoading: isDepositing,
    data: txData,
    isSuccess: txSuccess,
  } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess() {
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log("Transaction error: ", error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  //Get the nonce from the contract
  const unwatch = useContractEvent({
    address: despositValutAddressHH,
    abi,
    eventName: "DepositMade",
    listener(log) {
      if (log[0]?.args.depositIndex) {
        setNonceIn(log[0]?.args.depositIndex);
        if (log[0]?.args.depositIndex === nonceIn) {
          unwatch?.();
        }
      }
    },
  });

  function saveContactFunction() {
    if (transaction.contact && transaction.phone) {
      console.log("Saving contact...");
      mutateContact({
        name: transaction.contact,
        phone: countryCode.additionalProperties.code + transaction.phone,
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
    if (
      transaction.amount !== 0 &&
      transaction.phone !== "" &&
      txId &&
      nonceIn
    ) {
      // setTransaction(getTransaction());
      const amountInUSD = transaction.amount * ethPrice;
      const formattedPhone = formatPhone(transaction.phone);
      const numberNonce = Number(nonceIn);
      mutate({
        ...transaction,
        phone: countryCode.additionalProperties.code + formattedPhone,
        amountInUSD: amountInUSD,
        txId: txId,
        nonce: numberNonce,
      });
    } else {
      console.error("Error saving transaction");
    }
  };

  useEffect(() => {
    if (nonceIn && txData && txSuccess) {
      setNonce("nonce", Number(nonceIn));
      saveTransaction({ txId: txData.transactionHash });
    }
  }, [nonceIn, txData, txSuccess]);

  return (
    <>
      {isDepositing || isSaving ? (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      ) : null}
      {errorSavingTransaction ? (
        <div>There was an error saving the transaction!</div>
      ) : (
        <button
          onClick={() => void sendFunction()}
          disabled={isSaving || isDepositLoading || isDepositing}
          className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDepositLoading
            ? "Waiting for approval"
            : isSaving || isDepositing
            ? "Please wait"
            : "Send"}
        </button>
      )}
    </>
  );
};

export default DepositButton;
