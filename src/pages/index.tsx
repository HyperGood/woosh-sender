import type { Transaction } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div>
      {transaction.phone} - {transaction.amount} {transaction.token}
    </div>
  );
};

const UserTransactions = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.transaction.getTransactions.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) return <div>No data</div>;

  return (
    <div>
      {data.map((transaction) => (
        <div key={transaction.id}>
          <TransactionCard transaction={transaction} />
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const { isConnected } = useAccount();
  const { data: session } = useSession();
  // const [newTransaction, setNewTransaction] = useState<Transaction | null>(
  //   null
  // );
  const ctx = api.useContext();
  console.log(session?.user.id);

  return (
    <Layout>
      {isConnected && session ? (
        <>
          <div>Welcome!</div>
          <UserTransactions />
        </>
      ) : (
        <div>Connect your wallet to get started</div>
      )}
    </Layout>
  );
}
