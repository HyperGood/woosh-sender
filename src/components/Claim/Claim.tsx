import { contractAddress, abi } from "~/lib/DepositVaultABI";
import { isHex, parseEther } from "viem";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import Button from "../Button";
import { type Transaction } from "@prisma/client";

export const Claim = ({
  transaction,
  setClaimed,
}: {
  transaction: Transaction;
  setClaimed: Dispatch<SetStateAction<boolean>>;
}) => {
  const [secret, setSecret] = useState<string>();
  const debouncedSecret = useDebounce(secret, 500);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: contractAddress[420][0],
    abi,
    functionName: "withdraw",
    args: [
      parseEther(transaction.amount.toString() || "0"),
      BigInt(transaction.nonce || 0),
      isHex(debouncedSecret) ? debouncedSecret : "0x",
      address || "0x0",
    ],
    enabled: address && debouncedSecret ? true : false,
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

  const { write: withdraw, isLoading } = useContractWrite({
    ...config,
    onSuccess: () => {
      console.log("Tx success");
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
    onError: (error) => {
      console.log("Error withdrawing: ", error);
    },
  });

  useEffect(() => {
    console.log("isConnected: ", isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (address && debouncedSecret) {
      console.log("Recipient: ", address);
      console.log("Secret: ", debouncedSecret);
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
      <div>Connected to: {chain?.name}</div>
      <div>User Address: {address}</div>
      <div>
        <h2 className="mb-1 text-3xl">Claim your $50 that John sent you!</h2>
        <p>Enter the secret John sent you</p>
        <textarea
          onChange={(e) => setSecret(e.target.value)}
          value={secret}
          className="mb-12  mt-4 w-full rounded-xl border border-brand-black/20 bg-transparent p-4"
          placeholder="Enter the secret. It starts with 0x"
        />
        <Button
          intent="accent"
          fullWidth
          onClick={() => {
            console.log("Withdrawing...");
            withdraw?.();
          }}
          disabled={secret && !isLoading ? false : true}
        >
          Claim
        </Button>
      </div>
      <button className="font-bold underline">
        I don&apos;t have a secret code
      </button>
    </div>
  );
};
