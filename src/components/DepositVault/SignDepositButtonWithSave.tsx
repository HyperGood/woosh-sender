import { useNetwork, useSignTypedData } from "wagmi";
import { contractAddress, type Addresses } from "~/lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { type Hex, parseEther, parseUnits } from "viem";
import type { TransactionForm } from "~/models/transactions";
import type { Transaction } from "@prisma/client";
import Button from "../Button";
import { api } from "~/utils/api";
import useTokenPrices from "~/hooks/useTokenPrices";
import { env } from "~/env.mjs";
// import { ECDSAProvider } from "@zerodev/sdk";
// import { env } from "~/env.mjs";
// import { getPasskeyOwner } from "@zerodev/sdk/passkey";
// import { verifyMessage } from "@ambire/signature-validator";
// import { ethers } from "ethers";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  secret,
  setSavedTransaction,
}: {
  transaction: TransactionForm;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  secret?: string;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
}) => {
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const tokenDecimals = env.NEXT_PUBLIC_TESTNET === "true" ? 18 : 6;
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";
  const { tokenPrices } = useTokenPrices();
  const tokenPrice =
    transaction.token === "ETH"
      ? tokenPrices?.["ethereum"].usd
      : tokenPrices?.["usd-coin"].usd;
  const ctx = api.useContext();
  const { mutate } = api.transaction.addTransaction.useMutation({
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
    chainId: chainId ? chainId : 10,
    verifyingContract: depositVaultAddress as Hex,
  };

  const types = {
    Withdrawal: [
      { name: "amount", type: "uint256" },
      { name: "depositIndex", type: "uint256" },
    ],
  };

  const message = {
    amount:
      transaction.token === "ETH"
        ? parseEther(transaction.amount.toString())
        : parseUnits(transaction.amount.toString(), tokenDecimals),
    depositIndex: BigInt(transaction.depositIndex || 0),
  };

  // const signWithAA = async () => {
  //   const provider = await ECDSAProvider.init({
  //     projectId: env.NEXT_PUBLIC_ZERODEV_ID,
  //     owner: await getPasskeyOwner({
  //       projectId: env.NEXT_PUBLIC_ZERODEV_ID,
  //     }),
  //     opts: {
  //       paymasterConfig: {
  //         policy: "VERIFYING_PAYMASTER",
  //       },
  //     },
  //   });

  //   const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
  //     `https://opt-goerli.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_ID}`
  //   );
  //   const signingAddress = await provider.getAddress();

  //   const typedData = {
  //     types,
  //     message,
  //     primaryType: "Withdrawal",
  //     domain,
  //   };

  //   console.log(typedData);

  //   const signature = await provider.signTypedData(typedData);

  //   console.log("Signing address: ", signingAddress);
  //   console.log(signature);

  //   console.log(
  //     await verifyMessage({
  //       signer: signingAddress,
  //       typedData,
  //       signature,
  //       provider: jsonRpcProvider,
  //     })
  //   );
  // };

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
    if (transaction.amount !== 0) {
      const amountInUSD = transaction.amount * (tokenPrice || 1);
      console.log(
        "Saving transaction to database with this data...",
        transaction
      );
      mutate({
        ...transaction,
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
            //void signWithAA();
            signTypedData();
            saveTransaction();
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? "Waiting for Signature" : "Generate Secret"}
      </Button>
    </>
  );
};

export default SignDepositButton;
