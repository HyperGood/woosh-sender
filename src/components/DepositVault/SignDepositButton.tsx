import { useSignTypedData } from "wagmi";
import { despositValutAddressHH } from "~/lib/constants";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { parseEther } from "viem";
import type { PhoneTransaction } from "~/models/transactions";
import type { Transaction } from "@prisma/client";
import Button from "../Button";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  nonce,
  card,
  secret,
}: {
  transaction: PhoneTransaction | Transaction;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  nonce: bigint;
  card?: boolean;
  secret?: string;
}) => {
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
      }
    },
  });

  return (
    <>
      <Button
        onClick={() => {
          if (!secret) signTypedData();
        }}
        disabled={isLoading}
        intent={card ? "none" : "primary"}
      >
        {isLoading ? "Waiting for Signature" : "Generate Secret"}
      </Button>
    </>
  );
};

export default SignDepositButton;
