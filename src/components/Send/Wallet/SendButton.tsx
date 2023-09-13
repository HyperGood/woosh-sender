import { parseEther, parseUnits } from "viem";
import useDebounce from "~/hooks/useDebounce";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { LoadingSpinner } from "~/components/Loading";
import type { Transaction } from "@prisma/client";
import { type WalletTransaction } from "~/models/transactions";
import Button from "~/components/Button";
import { env } from "~/env.mjs";
import { outAddress } from "~/lib/erc-20/opg-out";
import { usdcAddress } from "~/lib/erc-20/op-usdc";

export const SendButton = ({
  transaction,
  setFundsSent,
  saveContact,
  setSavedTransaction,
}: {
  transaction: WalletTransaction;
  setFundsSent: Dispatch<SetStateAction<boolean>>;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  saveContact: CheckedState;
}) => {
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const debouncedAmount = useDebounce(transaction.amount, 500);
  const debouncedTo = useDebounce(transaction.address, 500);
  const ctx = api.useContext();
  const tokenAddress =
    env.NEXT_PUBLIC_TESTNET === "true" ? outAddress : usdcAddress;
  const { address } = useAccount();

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

  //Send USDC

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
    args: [address || "0x0", parseUnits(debouncedAmount.toString(), 18)],
    enabled: Boolean(transaction.token !== "ETH"),
  });

  const {
    data: approvalData,
    write: approveTokens,
    isLoading: waitingForApproval,
  } = useContractWrite({
    ...approveTokenConfig,
    onError(error) {
      if (error.message.includes("User rejected the request")) {
        toast.error(
          "It looks like you rejected the approval in your wallet. Try again and accept the approval."
        );
      } else {
        console.log("There was an error approving the spend ", error);
        toast.error(`Deposit error: ${error.message}`);
      }
    },
    onSuccess() {
      console.log("Transaction Executed!");
    },
  });

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: approvalData?.hash,
    onSuccess(txData) {
      console.log("Approved! Approval Data: ", txData);
      console.log("Depositing funds...");
      // sendTokens?.();
    },
    onError(error) {
      console.log("Transaction error: ", error);
      toast.error(`The transaction failed: ${error.message}`);
    },
  });

  const { config: sendTokensConfig } = usePrepareContractWrite({
    address: tokenAddress,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "transferFrom",
    args: [
      address || "0x0",
      debouncedTo as `0x${string}`,
      parseUnits(debouncedAmount.toString(), 18),
    ],
    enabled: Boolean(approvalData) && Boolean(transaction.token !== "ETH"),
    onError(err) {
      toast.error(err.message);
    },
  });

  const {
    data: sendTokensHash,
    write: sendTokens,
    isLoading: isSending,
  } = useContractWrite({
    ...sendTokensConfig,
    onError(error) {
      if (error.message.includes("User rejected the request")) {
        toast.error(
          "It looks like you rejected the transaction in your wallet. Try again and accept the transaction."
        );
        toast.error("Don't worry no funds were sent.");
      } else {
        console.log("There was an approving the token spend ", error);
        toast.error(`Deposit error: ${error.message}`);
      }
    },
    onSuccess() {
      console.log("Transaction Executed!");
    },
  });

  useWaitForTransaction({
    hash: sendTokensHash?.hash,
    onSuccess(txData) {
      console.log("Approved! Approval Data: ", txData);
      toast.success("Funds sent");
      saveTransaction({ txId: txData.transactionHash });
    },
    onError(error) {
      console.log("Transaction error: ", error);
      toast.error(`The transaction failed: ${error.message}`);
    },
  });

  /* ERC-20 Send Batch
  const { config: sendTokensBatchConfig } = usePrepareContractBatchWrite({
    calls: [
      {
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
        args: [address || "0x0", parseUnits(debouncedAmount.toString(), 18)],
      },
      {
        address: tokenAddress,
        abi: [
          {
            inputs: [
              { internalType: "address", name: "sender", type: "address" },
              { internalType: "address", name: "recipient", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "transferFrom",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "transferFrom",
        args: [
          address || "0x0",
          debouncedTo as `0x${string}`,
          parseUnits(debouncedAmount.toString(), 18),
        ],
      },
    ],
    enabled: transaction.token !== "ETH",
  });

  const {
    sendUserOperation: sendTokens,
    isLoading,
    data,
  } = useContractBatchWrite(sendTokensBatchConfig);

  useWaitForTransaction({
    hash: data ? data.hash : undefined,
    enabled: !!data,
    onSuccess() {
      console.log("Transaction was successful.");
      console.log(data);
      saveTransaction({ txId: data?.hash as Hex });
    },
    onError() {
      console.error("Transaction failed.");
    },
  });

  */

  /*Send ETH*/
  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? parseEther(debouncedAmount.toString()) : undefined,
    enabled:
      transaction.token === "ETH" && debouncedAmount && debouncedTo
        ? true
        : false,
  });

  const {
    data: sendData,
    sendTransaction: sendETH,
    isSuccess: waitingForETHApproval,
  } = useSendTransaction({
    ...config,
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

  const { isLoading: isSendingETH } = useWaitForTransaction({
    hash: sendData?.hash,
    onSuccess(txData) {
      console.log("txData: ", txData);
      saveTransaction({ txId: txData.transactionHash });
      if (saveContact) saveContactFunction();
      toast.success(`Funds sent!`);
    },
    onError(error) {
      console.log(error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  function saveContactFunction() {
    if (transaction.contact && transaction.address) {
      mutateContact({
        name: transaction.contact,
        address: transaction.address,
      });
    } else {
      console.log("Error saving contact");
    }
  }

  const sendFunction = () => {
    if (transaction.address === "") {
      alert("Please enter an ETH address or ENS name");
    } else if (transaction.amount === 0) {
      alert("Please enter an amount greater than 0");
    } else {
      if (transaction.token === "ETH") {
        console.log(transaction);
        sendETH?.();
      } else {
        approveTokens?.();
      }
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
      {/* {isSending && (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      )} */}

      {approvalData ? (
        <Button onClick={() => sendTokens?.()} disabled={isSending}>
          <div className="flex items-center gap-2">
            Send Funds
            {isSending ? <LoadingSpinner /> : null}
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => void sendFunction()}
          disabled={waitingForApproval || isSending || isApproving}
        >
          <div className="flex items-center gap-2">
            {waitingForApproval ? "Approving" : "Approve transaction"}
            {isSending || isApproving || waitingForApproval ? (
              <LoadingSpinner />
            ) : null}
          </div>
        </Button>
      )}
    </>
  );
};

export default SendButton;
