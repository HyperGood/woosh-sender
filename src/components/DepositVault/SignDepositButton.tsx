import { useSignTypedData } from "wagmi";
import { despositValutAddressHH } from "~/lib/constants";
import type { TransactionForm } from "../Send/Phone/SendToPhone";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { parseEther } from "viem";
import type { Transaction } from "@prisma/client";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  nonce,
}: {
  transaction: TransactionForm | Transaction;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  nonce: bigint;
}) => {
  console.log(nonce);
  const domain = {
    name: "DepositVault",
    version: "1.0.0",
    chainId: 31337,
    verifyingContract: despositValutAddressHH,
  } as const;

  const types = {
    Withdrawal: [
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" },
    ],
  } as const;

  const message = {
    amount: parseEther(transaction.amount.toString()),
    nonce: nonce,
  } as const;

  const { isLoading, signTypedData } = useSignTypedData({
    domain,
    message,
    types,
    primaryType: "Withdrawal",
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      setSecret(data);
      if (setDepositSigned) {
        setDepositSigned(true);
      } else {
        alert(data);
      }
    },
  });

  return (
    <>
      <button
        onClick={() => signTypedData()}
        disabled={isLoading}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Waiting for Signature" : "Generate Secret"}
      </button>
    </>
  );
};

export default SignDepositButton;
