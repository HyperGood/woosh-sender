import type { Transaction } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import { useAccount } from "wagmi";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

interface TransactionForm {
  amount: number;
  token: string;
  phone: string;
  recipient?: string;
}

const Send = () => {
  const [transaction, setFields] = useReducer(
    (
      current: TransactionForm,
      update: Partial<TransactionForm>
    ): TransactionForm => ({
      ...current,
      ...update,
    }),
    {
      amount: 0,
      token: "",
      phone: "",
    }
  );

  const ctx = api.useContext();

  const { mutate, isLoading: isSending } = api.transaction.add.useMutation({
    onSuccess: () => {
      console.log("Sent!");
      void ctx.transaction.getTransactions.invalidate();
    },
  });

  const sendFunction = () => {
    if (transaction.amount !== 0 && transaction.phone !== "") {
      const amountInUSD = transaction.amount * 2000;
      const txId = "0x1234";
      mutate({
        ...transaction,
        amountInUSD: amountInUSD,
        txId: txId,
      });
    }
  };

  return (
    <div className="flex gap-8">
      <input
        type="number"
        value={transaction.amount}
        onChange={(e) => setFields({ amount: parseInt(e.target.value) })}
        className="border-2 border-gray-300 p-2"
        placeholder="Amount"
        min={0}
        required
      />
      <input
        type="text"
        value={transaction.token}
        onChange={(e) => setFields({ token: e.target.value })}
        className="border-2 border-gray-300 p-2"
        placeholder="ETH"
        required
      />
      <input
        type="text"
        value={transaction.phone}
        onChange={(e) => setFields({ phone: e.target.value })}
        className="border-2 border-gray-300 p-2"
        placeholder="Phone number"
        required
      />
      <input
        type="text"
        value={transaction.recipient}
        onChange={(e) => setFields({ recipient: e.target.value })}
        className="border-2 border-gray-300 p-2"
        placeholder="Recipient Name"
      />
      <button
        onClick={() => void sendFunction()}
        disabled={isSending}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Send
      </button>
    </div>
  );
};

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
  // const ctx = api.useContext();
  console.log(session?.user.id);

  return (
    <Layout>
      {isConnected && session ? (
        <div className="-mt-20 flex h-screen flex-col items-center justify-center gap-20">
          <div>Welcome!</div>
          <Send />
          <UserTransactions />
        </div>
      ) : (
        <div>Connect your wallet to get started</div>
      )}
    </Layout>
  );
}
