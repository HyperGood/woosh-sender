import { type Transaction } from "@prisma/client";
import { ConnectKitButton } from "connectkit";
import { type InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Button from "~/components/Button";
import WithdrawButton from "~/components/DepositVault/WithdrawButton";
import {
  getTransactionById,
  getAllPhoneTransactions,
} from "~/server/api/routers/transactions";
import { prisma } from "~/server/db";

export default function Claim({
  transaction,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      setSecret("");
      void router.push("/");
    },
  });
  const [secret, setSecret] = useState<`0x${string}` | string>();
  const formattedTransaction = JSON.parse(transaction) as Transaction;

  //If transaction is claimed, return claimed on [date and time] by [wallet]
  if (formattedTransaction.claimed) {
    return <div>Transaction claimed</div>;
  }
  return (
    <div>
      <div>
        <h1 className="mb-4 text-4xl font-bold">Claim your tokens</h1>
        {formattedTransaction.phone}
        <div>Nonce: {formattedTransaction.nonce}</div>
        {isConnected ? (
          <div>
            <div className="mb-4 flex flex-col gap-2 rounded-md bg-brand-gray-light p-4">
              <span className="text-lg">Connected to {address}</span>
              <Button onClick={() => disconnect()}>Disconnect</Button>
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-sm opacity-80">Secret</label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
                placeholder="Enter the secret"
              />
            </div>

            <WithdrawButton
              secret={secret || ""}
              transactionId={formattedTransaction.id}
              amount={formattedTransaction.amount}
              nonce={BigInt(formattedTransaction.nonce || 0)}
            />
          </div>
        ) : (
          <ConnectKitButton />
        )}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const transactions = await getAllPhoneTransactions({ prisma });

  const paths = transactions.map((transaction: Transaction) => ({
    params: { id: transaction.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const transaction = await getTransactionById({
    prisma,
    input: { id: params.id },
  });
  if (!transaction) {
    return {
      notFound: true,
    };
  }

  return {
    props: { transaction: JSON.stringify(transaction) },
    revalidate: 1,
  };
}
