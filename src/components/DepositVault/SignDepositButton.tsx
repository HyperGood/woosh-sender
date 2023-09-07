import { useNetwork, useSignTypedData } from "wagmi";
import { contractAddress, type Addresses } from "~/lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { parseEther } from "viem";
import type { PhoneTransaction } from "~/models/transactions";
import Button from "../Button";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  card,
  secret,
}: {
  transaction: PhoneTransaction;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  card?: boolean;
  secret?: string;
}) => {
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";
  const domain = {
    name: "DepositVault",
    version: "1.0.0",
    chainId: chainId,
    verifyingContract: depositVaultAddress,
  } as const;

  const types = {
    Withdrawal: [
      { name: "amount", type: "uint256" },
      { name: "depositIndex", type: "uint256" },
    ],
  } as const;

  const message = {
    amount: parseEther(transaction.amount.toString()),
    depositIndex: BigInt(transaction.depositIndex || 0),
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
