import { abi } from "../../lib/DepositVaultABI";
import { parseEther } from "viem";
import useDebounce from "~/hooks/useDebounce";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import { contractAddress, type Addresses } from "../../lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import { type Dispatch, type SetStateAction } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { PhoneTransactionForm } from "~/models/transactions";
import { type Country } from "~/lib/countries";
import { type UseFormSetValue } from "react-hook-form";
import Button from "../Button";

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

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: depositVaultAddress,
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
      setFormValue("nonce", Number(txData.logs[0]?.topics[2]));
      setFundsSent(true);
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log("Transaction error: ", error);
      toast.error(`The transaction failed: ${error.message}`);
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
      deposit?.();
    }
  };

  return (
    <>
      {isDepositing ? (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      ) : null}

      <Button
        onClick={() => void sendFunction()}
        disabled={isDepositLoading || isDepositing}
        intent="secondary"
      >
        {isDepositLoading ? "Waiting for approval" : "Send"}
      </Button>
    </>
  );
};

export default DepositButton;
