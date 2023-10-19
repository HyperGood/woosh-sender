import { useAccount, useNetwork, useSignTypedData } from "wagmi";
import { contractAddress, type Addresses } from "~/lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { parseEther, parseUnits } from "viem";
import type { Transaction } from "~/models/transactions";
import Button from "../Button";
import { ZeroDevEthersProvider } from "@zerodev/sdk";
import { env } from "~/env.mjs";
import { getPasskeyOwner } from "@zerodev/sdk/passkey";
import { verifyMessage } from "@ambire/signature-validator";

export const SignDepositButton = ({
  transaction,
  setSecret,
  setDepositSigned,
  card,
  secret,
}: {
  transaction: Transaction;
  setSecret: Dispatch<SetStateAction<string>>;
  setDepositSigned?: Dispatch<SetStateAction<boolean>>;
  card?: boolean;
  secret?: string;
}) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const chainId = chain?.id;
  const tokenDecimals = env.NEXT_PUBLIC_TESTNET === "true" ? 18 : 6;
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
  };

  const message = {
    amount:
      transaction.token === "ETH"
        ? parseEther(transaction.amount.toString())
        : parseUnits(transaction.amount.toString(), tokenDecimals),
    depositIndex: BigInt(transaction.depositIndex || 0),
  } as const;

  const signWithAA = async () => {
    const provider = await ZeroDevEthersProvider.init("ECDSA", {
      projectId: env.NEXT_PUBLIC_ZERODEV_ID,
      owner: await getPasskeyOwner({
        projectId: env.NEXT_PUBLIC_ZERODEV_ID,
      }),
    });
    const signer = provider.getAccountSigner();

    const typedData = {
      domain,
      types,
      message,
      primaryType: "Withdrawal",
    };

    // const digest = TypedDataUtils.eip712Hash(
    //   { domain, types, message },
    //   SignTypedDataVersion.V4
    // );

    const signature = await signer.signTypedDataWith6492(typedData);

    console.log(signature);

    console.log(
      await verifyMessage({
        signer: address,
        typedData,
        signature: signature,
        provider,
      })
    );
  };

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
          if (!secret) void signWithAA();
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
