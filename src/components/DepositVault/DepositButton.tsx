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
import { type Dispatch, type SetStateAction } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { PhoneTransactionForm } from "~/models/transactions";
import { type Country } from "~/lib/countries";
import { type UseFormSetValue } from "react-hook-form";

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

  const { mutate: mutateContact } = api.contact.add.useMutation({
    onSuccess: () => {
      console.log("Successfully added contact");
      void ctx.contact.getContacts.invalidate();
    },
    onError: (error) => {
      console.log("There was an error saving the contact", error);
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

  const { isLoading: isDepositing } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess(txData) {
      console.log("txData: ", txData);
      setFormValue("txId", txData.transactionHash);
      setFormValue("nonce", Number(txData.logs[0]?.topics[2]));
      setFundsSent(true);
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log("Transaction error: ", error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  // // Get the nonce from the contract
  // const unwatch = useContractEvent({
  //   address: despositValutAddressHH,
  //   abi,
  //   eventName: "DepositMade",
  //   listener(log) {
  //     console.log("Event triggered!");
  //     console.log(log);
  //     if (
  //       log[0]?.args.depositIndex ||
  //       log[0]?.args.depositIndex === BigInt(0)
  //     ) {
  //       console.log("Setting nonce...");
  //       setFormValue("nonce", Number(log[0]?.args.depositIndex) + 1);
  //       console.log("Nonce is set");
  //       unwatch?.();
  //     }
  //   },
  // });

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

  return (
    <>
      {isDepositing ? (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      ) : null}

      <button
        onClick={() => void sendFunction()}
        disabled={isDepositLoading || isDepositing}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        {isDepositLoading ? "Waiting for approval" : "Send"}
      </button>
    </>
  );
};

export default DepositButton;
