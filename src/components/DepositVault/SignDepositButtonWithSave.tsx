import { useNetwork, useSignTypedData } from "wagmi";
import { contractAddress, type Addresses } from "~/lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { useContext } from "react";
import { parseEther } from "viem";
import type { PhoneTransaction } from "~/models/transactions";
import type { Transaction } from "@prisma/client";
import Button from "../Button";
import { api } from "~/utils/api";
import { formatPhone } from "~/lib/formatPhone";
import { CryptoPricesContext } from "~/context/TokenPricesContext";
import { type Country } from "~/lib/countries";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  secret,
  setSavedTransaction,
  countryCode,
}: {
  transaction: PhoneTransaction;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  secret?: string;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  countryCode: Country;
}) => {
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const ctx = api.useContext();
  const { mutate } = api.transaction.addPhoneTransaction.useMutation({
    onSuccess: (data) => {
      console.log("Transaction saved to database! Here's the data: ", data);
      setSavedTransaction(data);
      void ctx.transaction.getAllTransactionsByUser.invalidate();
    },
    onError: (error) => {
      console.log("There was an error saving the transaction ", error);
    },
  });

  const domain = {
    name: "DepositVault",
    version: "1.0.0",
    chainId: chainId,
    verifyingContract: depositVaultAddress,
  } as const;

  const types = {
    Withdrawal: [
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" },
    ],
  } as const;

  const message = {
    amount: parseEther(transaction.amount.toString()),
    nonce: BigInt(transaction.nonce || 0),
  } as const;
  console.log("nonce: ", transaction.nonce);
  console.log("amount: ", transaction.amount);
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

  const saveTransaction = () => {
    if (transaction.amount !== 0 && transaction.phone !== "") {
      const amountInUSD = transaction.amount * ethPrice;
      console.log(
        "Saving transaction to database with this data...",
        transaction
      );
      const formattedPhone = formatPhone(transaction.phone);
      mutate({
        ...transaction,
        phone: countryCode.additionalProperties.code + formattedPhone,
        amountInUSD: amountInUSD,
      });
    } else {
      console.log("Error saving transaction");
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          if (!secret) {
            signTypedData();
            saveTransaction();
          }
        }}
        disabled={isLoading}
        intent="secondary"
      >
        {isLoading ? "Waiting for Signature" : "Generate Secret"}
      </Button>
    </>
  );
};

export default SignDepositButton;
