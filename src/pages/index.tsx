import type { Transaction } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useReducer } from "react";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { abi } from "../../contract-abi";
import { parseEther } from "ethers";
import useDebounce from "~/hooks/useDebounce";

const despositValutAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
      token: "ETH",
      phone: "",
    }
  );
  const debouncedAmount = useDebounce(transaction.amount, 500);
  const { mutate, isLoading: isSaving } = api.transaction.add.useMutation({
    onSuccess: () => {
      console.log("Saved!");
      void ctx.transaction.getTransactions.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: despositValutAddress,
    abi,
    functionName: "deposit",
    value: parseEther(debouncedAmount.toString()),
    enabled: Boolean(debouncedAmount),
  });

  const {
    data: depositData,
    write: deposit,
    isLoading: isDepositLoading,
    error: depositError,
  } = useContractWrite(contractWriteConfig);

  const {
    isLoading: isDepositing,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess(txData) {
      console.log("txData: ", txData);
      saveTransaction({ txId: txData.transactionHash });
    },
  });

  useContractEvent({
    address: despositValutAddress,
    abi,
    eventName: "DepositMade",
    listener(log) {
      console.log("Event: ", log);
    },
  });

  const ctx = api.useContext();

  const sendFunction = () => {
    if (transaction.phone === "") {
      alert("Please enter a phone number");
    } else if (transaction.amount === 0) {
      alert("Please enter an amount greater than 0");
    } else {
      deposit?.();
    }
  };

  const saveTransaction = ({ txId }: { txId: string }) => {
    if (transaction.amount !== 0 && transaction.phone !== "" && txId) {
      const amountInUSD = transaction.amount * 2000;
      mutate({
        ...transaction,
        amountInUSD: amountInUSD,
        txId: txId,
      });
    } else {
      console.log("Error saving transaction");
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
        disabled={isSaving || isDepositLoading || isDepositing}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Send
      </button>
      {isDepositLoading && <span>Waiting for approval</span>}
      {isDepositing && <span>Sending funds...</span>}

      {depositError && (
        <span className="text-red font-bold">{depositError.message}</span>
      )}
      {txError && <span className="text-red font-bold">{txError.message}</span>}

      {txSuccess && <span className="text-green font-bold">Sent!</span>}
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
