import {
  useAccount,
  useNetwork,
  useSignTypedData,
  useWalletClient,
} from "wagmi";
import { contractAddress, type Addresses } from "~/lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { parseEther } from "viem";
import type { PhoneTransactionForm } from "~/models/transactions";
import type { Transaction } from "@prisma/client";
import Button from "../Button";
import { api } from "~/utils/api";
import { formatPhone } from "~/lib/formatPhone";
import { type Country } from "~/lib/countries";
import useTokenPrices from "~/hooks/useTokenPrices";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  secret,
  setSavedTransaction,
  countryCode,
}: {
  transaction: PhoneTransactionForm;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  secret?: string;
  setSavedTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  countryCode: Country;
}) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data } = useWalletClient();
  const chainId = chain?.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";
  const { cryptoPrices } = useTokenPrices();
  const tokenPrice =
    transaction.token === "ETH"
      ? cryptoPrices?.["ethereum"].usd
      : cryptoPrices?.["usd-coin"].usd;
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
      { name: "depositIndex", type: "uint256" },
    ],
  };

  const message = {
    amount: parseEther(transaction.amount.toString()),
    depositIndex: BigInt(transaction.depositIndex || 0),
  } as const;

  // const signWithAA = async () => {
  //   const provider = await ZeroDevEthersProvider.init("ECDSA", {
  //     projectId: env.NEXT_PUBLIC_ZERODEV_ID,
  //     owner: await getPasskeyOwner({
  //       projectId: env.NEXT_PUBLIC_ZERODEV_ID,
  //     }),
  //   });
  //   const signer = provider.getAccountSigner();
  //   const typedData = {
  //     domain,
  //     types,
  //     message,
  //     primaryType: "Withdrawal",
  //   };
  //   const signature = await signer._signTypedData(
  //     typedData.domain,
  //     typedData.types,
  //     {
  //       amount: parseEther(transaction.amount.toString()),
  //       depositIndex: BigInt(transaction.depositIndex || 0),
  //     }
  //   );
  //   console.log(signature);
  //   console.log(
  //     await verifyMessage({
  //       signer: address,
  //       typedData,
  //       signature: signature,
  //       provider,
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
    if (transaction.amount !== 0 && transaction.phone !== "") {
      const amountInUSD = transaction.amount * (tokenPrice || 1);
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
            void signWithAA();
            //signTypedData();
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
