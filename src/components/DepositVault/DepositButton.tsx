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
import { contractAddress, type Addresses } from "../../lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import { useEffect, type Dispatch, type SetStateAction, useState } from "react";
import type { TransactionForm } from "~/models/transactions";
import { type UseFormSetValue } from "react-hook-form";
import Button from "../Button";
import { env } from "~/env.mjs";
import { outAddress } from "../../lib/erc-20/opg-out";
import { usdcAddress } from "~/lib/erc-20/op-usdc";

export const DepositButton = ({
  transaction,
  setFundsSent,
  setFormValue,
}: {
  transaction: TransactionForm;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setFormValue: UseFormSetValue<TransactionForm>;
}) => {
  const debouncedAmount = useDebounce(transaction.amount, 500);
  console.log(debouncedAmount);
  console.log(transaction.token);
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const [depositIndexSet, setDepositIndexSet] = useState(false);
  const [txHashSet, setTxHashSet] = useState(false);
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";

  const tokenAddress =
    env.NEXT_PUBLIC_TESTNET === "true" ? outAddress : usdcAddress;
  const tokenDecimals = env.NEXT_PUBLIC_TESTNET === "true" ? 18 : 6;

  //Approve ERC-20 Tokens
  const { config: approveTokenConfig } = usePrepareContractWrite({
    address: tokenAddress,
    abi: [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
    ],
    functionName: "approve",
    args: [
      depositVaultAddress,
      parseUnits(debouncedAmount.toString(), tokenDecimals),
    ],
    enabled: Boolean(transaction.token !== "ETH"),
    onSuccess(data) {
      console.log(data);
    },
  });

  const {
    data: approvalData,
    write: approveTokens,
    isLoading: waitingForApproval,
  } = useContractWrite({
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
        : [parseUnits(debouncedAmount.toString(), tokenDecimals), tokenAddress],
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
    isLoading: waitingForDeposit,
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

  const sendFunction = () => {
    if (transaction.amount === 0) {
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
    waitingForDeposit: "Confirm the transaction",
  };

  //Add a disclaimer saying that you can always cancel a transaction before someone claims the funds
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {tokenApprovalData ? (
        <Button
          onClick={() => void deposit?.()}
          disabled={waitingForDeposit}
          loading={
            isDepositing ||
            isApproving ||
            waitingForApproval ||
            waitingForDeposit
          }
          size="full"
        >
          <div className="flex items-center gap-4">
            {waitingForDeposit
              ? status.waitingForDeposit
              : isDepositing || isApproving || waitingForApproval
              ? null
              : "Send funds"}
            {isDepositing ||
            isApproving ||
            waitingForApproval ||
            waitingForDeposit ? (
              <LoadingSpinner />
            ) : null}
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => void sendFunction()}
          disabled={waitingForDeposit}
          loading={
            isDepositing ||
            isApproving ||
            waitingForApproval ||
            waitingForDeposit
          }
          size="full"
        >
          <div className="flex items-center gap-4">
            {waitingForDeposit
              ? status.waitingForDeposit
              : isDepositing || isApproving || waitingForApproval
              ? null
              : "Send funds"}
            {isDepositing ||
            isApproving ||
            waitingForApproval ||
            waitingForDeposit ? (
              <LoadingSpinner />
            ) : null}
          </div>
        </Button>
      )}
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
