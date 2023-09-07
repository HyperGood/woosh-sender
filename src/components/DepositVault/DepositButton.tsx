import { abi } from "../../lib/DepositVaultABI";
import { parseEther, parseUnits, zeroAddress } from "viem";
import useDebounce from "~/hooks/useDebounce";
import {
  useContractEvent,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import { contractAddress, type Addresses } from "../../lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import { useEffect, type Dispatch, type SetStateAction, useState } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { PhoneTransactionForm } from "~/models/transactions";
import { type Country } from "~/lib/countries";
import { type UseFormSetValue } from "react-hook-form";
import Button from "../Button";
import { tokenAbi, outAddress } from "../../lib/OUT-ABI";

export const DepositButton = ({
  transaction,
  setFundsSent,
  saveContact,
  countryCode,
  setFormValue,
}: {
  transaction: PhoneTransactionForm;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setFormValue: UseFormSetValue<PhoneTransactionForm>;
  saveContact: CheckedState;
  countryCode: Country;
}) => {
  const debouncedAmount = useDebounce(transaction.amount, 500);
  const ctx = api.useContext();
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const [depositIndexSet, setDepositIndexSet] = useState(false);
  const [txHashSet, setTxHashSet] = useState(false);
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";

  const { mutate: mutateContact } = api.contact.add.useMutation({
    onSuccess: () => {
      console.log("Successfully added contact");
      void ctx.contact.getContacts.invalidate();
    },
    onError: (error) => {
      toast.error(`There was an error saving the contact ${error.message}`);
    },
  });

  //Approve ERC-20 Tokens

  const { config: approveTokenConfig } = usePrepareContractWrite({
    address: "0x32307adfFE088e383AFAa721b06436aDaBA47DBE",
    functionName: "approve",
    args: [depositVaultAddress, parseUnits(debouncedAmount.toString(), 18)],
    abi: tokenAbi,
    enabled: Boolean(transaction.token !== "ETH"),
  });

  const { data: approvalData, write: approveTokens } = useContractWrite({
    ...approveTokenConfig,
    onError(error) {
      if (error.message.includes("User rejected the request")) {
        toast.error("Don't worry no funds were sent.");
        toast.error(
          "It looks like you rejected the transaction in your wallet. Try again and accept the transaction."
        );
      } else {
        console.log("There was an approving the token spend ", error);
        toast.error(`Deposit error: ${error.message}`);
      }
    },
    onSuccess() {
      console.log("Transaction Executed!");
    },
  });

  const { data: tokenApprovalData, isLoading: isApproving } =
    useWaitForTransaction({
      hash: approvalData?.hash,
      onSuccess(txData) {
        console.log("Approved! Approval Data: ", txData);
        console.log("Depositing funds...");
        deposit?.();
      },
      onError(error) {
        console.log("Transaction error: ", error);
        toast.error(`The transaction failed: ${error.message}`);
      },
    });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: depositVaultAddress,
    abi,
    functionName: "deposit",
    value:
      transaction.token === "ETH"
        ? parseEther(debouncedAmount.toString())
        : parseEther("0"),
    args:
      transaction.token === "ETH"
        ? [parseUnits("0", 18), zeroAddress]
        : [parseUnits(debouncedAmount.toString(), 18), outAddress],
    enabled:
      transaction.token === "ETH"
        ? Boolean(debouncedAmount)
        : Boolean(debouncedAmount && tokenApprovalData),
    onError(error) {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess(data) {
      console.log("Ready ", data);
    },
  });

  const {
    data: depositData,
    write: deposit,
    isLoading: isDepositLoading,
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

  const { isLoading: isDepositing } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess(txData) {
      if (saveContact) {
        saveContactFunction();
      }
      setFormValue("txId", txData.transactionHash);
      setTxHashSet(true);
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log("Transaction error: ", error);
      toast.error(`The transaction failed: ${error.message}`);
    },
  });

  useContractEvent({
    address: depositVaultAddress,
    abi,
    eventName: "DepositMade",
    listener(log) {
      console.log("Event: ", log);
      setFormValue("depositIndex", Number(log[0]?.args.depositIndex));
      setDepositIndexSet(true);
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
      toast.error("There was an error saving the contact.");
    }
  }

  const sendFunction = () => {
    if (transaction.phone === "") {
      alert("Please enter a phone number");
    } else if (transaction.amount === 0) {
      alert("Please enter an amount greater than 0");
    } else {
      if (transaction.token === "ETH") {
        deposit?.();
      } else {
        approveTokens?.();
      }
    }
  };

  useEffect(() => {
    //once an event has been emitted and there's a txHash, setFundsSent to true
    if (txHashSet && depositIndexSet) {
      setFundsSent(true);
    }
  }, [txHashSet, depositIndexSet, setFundsSent]);

  const status = {
    isDepositting: "Sending funds",
    isApproving: "Allowing your account to send tokens",
    isDepositLoading: "Confirm the transaction",
  };

  //Add a disclaimer saying that you can always cancel a transaction before someone claims the funds
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        onClick={() => void sendFunction()}
        disabled={isDepositLoading}
        loading={isDepositing || isApproving}
        fullWidth
      >
        <div className="flex items-center gap-4">
          {isDepositLoading
            ? status.isDepositLoading
            : isDepositing || isApproving
            ? null
            : "Send funds"}
          {isDepositing || isApproving ? <LoadingSpinner /> : null}
        </div>
      </Button>
      <span>
        {isDepositing
          ? status.isDepositting
          : isApproving
          ? status.isApproving
          : null}
      </span>
    </div>
  );
};

export default DepositButton;
