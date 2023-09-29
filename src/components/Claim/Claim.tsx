import { contractAddress, abi } from "~/lib/DepositVaultABI";
import { isHex } from "viem";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import Button from "../Button";
import { LoadingSpinner } from "../Loading";
import { type Transaction } from "@prisma/client";

export const Claim = ({
  transaction,
  setClaimed,
  sender,
}: {
  transaction: Transaction;
  setClaimed: Dispatch<SetStateAction<boolean>>;
  sender: string;
}) => {
  const [secret, setSecret] = useState<string>();
  const debouncedSecret = useDebounce(secret, 500);
  const { address, isConnected } = useAccount();
  const { config, isLoading: isPreparingWithdraw } = usePrepareContractWrite({
    address: contractAddress[420][0],
    abi,
    functionName: "withdraw",
    args: [
      BigInt(transaction.depositIndex || 0),
      isHex(debouncedSecret) ? debouncedSecret : "0x",
      address || "0x0",
    ],
    enabled: address && debouncedSecret ? true : false,
    onError(error) {
      console.error(error);
    },
  });

  const { mutate } = api.transaction.updateClaimedStatus.useMutation({
    onSuccess: () => {
      console.log("Transaction status updated");
      setClaimed(true);
    },
    onError: (error) => {
      console.log("Error updating claim status", error);
    },
  });

  const {
    write: withdraw,
    data,
    isLoading: isWithdrawing,
  } = useContractWrite({
    ...config,
  });

  const { isLoading: withdrawing } = useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data?.hash,
    onSuccess(data) {
      console.log("transaction successful");
      console.log("transaction data: ", data);
      if (address) {
        mutate({
          id: transaction.id,
          claimed: true,
          claimedAt: new Date(),
          claimedBy: address,
        });
      } else {
        console.log("error updating transaction");
        console.log("Claimer address: ", address);
      }
    },
  });

  useEffect(() => {
    console.log("isConnected: ", isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (address && debouncedSecret) {
      console.log("Recipient: ", address);
      console.log("Secret");
    } else if (!address && debouncedSecret) {
      console.log("No address");
    } else if (address && !debouncedSecret) {
      console.log("No secret");
    } else {
      console.log("No address or secret");
    }
  }, [address, debouncedSecret]);

  return (
    <div className="flex h-screen flex-col justify-between px-4 py-6">
      <div />
      <div>
        <h2 className="mb-1 text-3xl">
          Claim your ${transaction.amountInUSD.toFixed(2)} that {sender} sent
          you!
        </h2>
        <p>Enter the secret the sender sent you</p>
        <textarea
          onChange={(e) => setSecret(e.target.value)}
          value={secret}
          className="mb-12  mt-4 w-full rounded-xl border border-brand-black/20 bg-transparent p-4 focus:border-2 focus:border-brand-black focus:outline-none"
          placeholder="Enter the secret. It starts with 0x"
        />
        <div className="flex flex-col items-center gap-4">
          <Button
            size="full"
            onClick={() => {
              withdraw?.();
            }}
            disabled={secret || !isPreparingWithdraw ? false : true}
            loading={withdrawing || isWithdrawing}
          >
            <div className="flex items-center gap-4">
              {!withdrawing && !isWithdrawing ? "Claim" : null}
              {withdrawing || isWithdrawing ? <LoadingSpinner /> : null}
            </div>
          </Button>
          <span>
            {withdrawing
              ? "Sending funds to your account..."
              : isWithdrawing
              ? "Claiming funds..."
              : null}
          </span>
        </div>
      </div>
      <button className="font-bold underline">
        I don&apos;t have a secret code
      </button>
    </div>
  );
};
