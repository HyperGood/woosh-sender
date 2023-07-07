import type { Transaction } from "@prisma/client";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useReducer } from "react";
import {
  useAccount,
  useBalance,
  useContractEvent,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { abi } from "../lib/contract-abi";
import { parseEther } from "ethers";
import useDebounce from "~/hooks/useDebounce";
import { SiweMessage } from "siwe";
import Logo from "public/images/Logo";
import { WooshConnectButton } from "~/components/WooshConnectButton";
import Button from "~/components/Button";
import Image from "next/image";
import type { GetServerSideProps } from "next";
import { type CryptoPrices, CryptoPricesContext } from "~/context/TokenPricesContext";


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

const SignIn = () => {

    // Hooks
    const { data: sessionData } = useSession();
    // Wagmi Hooks
    const { signMessageAsync } = useSignMessage();
    const { address, isConnected } = useAccount();
  
    const { chain } = useNetwork();
  
    // Functions
    /**
     * Attempts SIWE and establish session
     */
    const onClickSignIn = async () => {
      try {
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId: chain?.id,
          // nonce is used from CSRF token
          nonce: await getCsrfToken(),
        });
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });
        void signIn("credentials", {
          message: JSON.stringify(message),
          redirect: false,
          signature,
        });
      } catch (error) {
        window.alert(error);
      }
    };
  

  
    useEffect(() => {
      if (isConnected && !sessionData) {
        void onClickSignIn();
      } 
    }, [isConnected]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-6 lg:px-0">
      <div>
      <Logo/>
      <h1 className="text-4xl max-w-[10ch] mt-4 mb-16">Send crypto to any phone number</h1>
      <WooshConnectButton/>
      </div>
    </div>
  )

}

const Divider = () => (
  <div className="h-[1px] w-full bg-brand-black/10 my-2"></div>
)


const Balances = () => {
  const { cryptoPrices} = useContext(CryptoPricesContext)
  const {address} = useAccount()
  const {data: ethBalance, isError: ethBalanceError, isLoading: ethBalanceLoading} = useBalance({
    address: address
  })

  interface UserBalance {
    token: string,
    tokenName: 'ethereum' | 'dai' | 'usd-coin',
    balance: number
  }

  const userBalances: UserBalance[] = [
    {
      token: 'ETH',
      tokenName: 'ethereum',
      balance: Number(ethBalance?.formatted) || 0
    },
    {
      token: 'DAI',
      tokenName: 'dai',
      balance: 200
    },
    {
      token: 'USDC',
      tokenName: 'usd-coin',
      balance: 800
    },
  ]

  console.log(userBalances)



  if(ethBalanceLoading) return <p>Loading...</p>
  if(ethBalanceError) {
    console.log("balanceError: ", ethBalanceError)
  }

  let totalBalance = 0

  if(ethBalance && cryptoPrices){
    for(const userBalance of userBalances) {
      if(cryptoPrices[userBalance.tokenName]?.usd){
        totalBalance += userBalance.balance * cryptoPrices[userBalance.tokenName]?.usd
      }
    }
}

  const Balance = ({token, balance, tokenName}: {token: string; balance: number; tokenName: 'ethereum' | 'usd-coin' | 'dai'}) => {
    const { cryptoPrices} = useContext(CryptoPricesContext)
    let balanceInUSD = 0
    if(cryptoPrices?.[tokenName]?.usd){
      balanceInUSD = balance * cryptoPrices?.[tokenName]?.usd
    }
    return (
      <div className="flex justify-between items-center px-4">
        <div className="flex gap-1 items-center">
        <Image src={`/images/tokens/${token}.svg`} width={16} height={16} alt={token} className="w-4 h-4 object-contain"/>
      <span>{balance} </span>

      <span>{token}</span>
      </div>
      <span>{balanceInUSD.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</span>
    </div>
    )
  }

return (
  <div>
    <p className="text-4xl mb-8 mt-4">{totalBalance.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
      })}</p>
    <Balance token="ETH" tokenName="ethereum" balance={Number(ethBalance?.formatted) || 0}/>
    <Divider/>
    <Balance token="USDC" tokenName="usd-coin" balance={800}/>
    <Divider/>
    <Balance token="DAI" tokenName="dai" balance={200}/>
  </div>
)
}

const Main = () => {

  return (
    <div className="px-4 lg:px-0 mt-[8rem] lg:mt-0">
      <span className="font-polysans block text-lg">welcome</span>
      <span className="font-polysans block text-2xl">roysandoval.eth</span>
      <Balances/>
      <div className="my-12 lg:mb-0 lg:mt-14 flex flex-col gap-8">
      <Button fullWidth>Send To A Phone Number</Button>
      <Button fullWidth>Send To An ETH Address</Button>
      </div>
    </div>
  )
}

const Contacts = () => {

  const Contact = ({name, phone, photo}: {name: string; phone: string; photo: number}) => {
    return (
      <div className="flex flex-col items-center gap-1 ">
        <Image src={`/images/avatars/${photo}.png`} width={48} height={48} alt={name} className="w-12 h-12 object-cover rounded-full"/>
        <span className="uppercase">{name}</span>
    
      </div>
    )
  }

  const contactsArr = [
    {
      Name: "Ali",
      Phone: "+1 (123) 456-7890",
      Photo: 1
    },
    {
      Name: "Henry",
      Phone: "+1 (123) 456-7890",
      Photo: 2
    },
    {
      Name: "Harry",
      Phone: "+1 (123) 456-7890",
      Photo: 3
    },
    {
      Name: "Fred",
      Phone: "+1 (123) 456-7890",
      Photo: 4
    },
    {
      Name: "Jacqueline",
      Phone: "+1 (123) 456-7890",
      Photo: 5
    },
    {
      Name: "Ali",
      Phone: "+1 (123) 456-7890",
      Photo: 1
    },
    {
      Name: "Henry",
      Phone: "+1 (123) 456-7890",
      Photo: 2
    },
    {
      Name: "Harry",
      Phone: "+1 (123) 456-7890",
      Photo: 3
    },
    {
      Name: "Fred",
      Phone: "+1 (123) 456-7890",
      Photo: 4
    },
    {
      Name: "Jacqueline",
      Phone: "+1 (123) 456-7890",
      Photo: 5
    },
  ]

return (
  <div>
    <p className="text-lg font-polysans mb-8">contacts ({contactsArr.length})</p>
    <div className="flex overflow-scroll md:overflow-hidden md:grid md:grid-cols-5 justify-items-start gap-8">
{contactsArr.map((contact, index) => (<div className="shrink-0" key={index}><Contact name={contact.Name} phone={contact.Phone} photo={contact.Photo}/></div>))}
    </div>
  </div>
)
}

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="bg-[#F1F3F2] text-brand-black rounded-md py-5 px-4 justify-between flex">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {
          transaction.recipient ? ( <>     <span className="font-polysans">{transaction.recipient}</span><span className="opacity-60">{transaction.phone}</span></>) : (<span className="font-polysans">{transaction.phone}</span>)
        }

      </div>
      <span className="opacity-60">{transaction.claimed ? "Claimed" : "Unclaimed"}</span>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="font-polysans">
      {transaction.amount} {transaction.token}
      </div>
      <span className="opacity-60">{transaction.amountInUSD.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
      })}</span>
      </div>
    </div>
  );
};

const PreviousSends = () => {
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
    <p className="text-lg font-polysans mb-5">previous sends</p>
    <div className="flex flex-col gap-5">
      {data.map((transaction) => (
        <div key={transaction.id}>
          <TransactionCard transaction={transaction} />
        </div>
      ))}
    </div>
    </div>
  );
};

export default function Home({coinsData}: {coinsData: CryptoPrices}) {
  const { setCryptoPrices} = useContext(CryptoPricesContext)
  const { isConnected } = useAccount();
  const { data: session } = useSession();
  const {disconnect} = useDisconnect()
  const onClickSignOut = async () => {
    await signOut();
    disconnect();
  };

  if(coinsData){
    setCryptoPrices(coinsData)
  }

  return (
    <Layout>
      {isConnected && session ? (
        <div className="h-full min-h-screen lg:h-screen w-full lg:grid lg:grid-cols-[1fr_44%] items-center relative">
          <div className="mx-auto">
          <Main/>
          <button
        onClick={() => void onClickSignOut()}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 lg:mt-20 absolute"
      >
        Sign Out
      </button>
          </div>
          <div className="w-full bg-brand-black text-brand-white h-full px-4 lg:px-8 pb-20 lg:pb-0 pt-20 lg:pt-40 flex flex-col gap-20">
            <Contacts/>
            <PreviousSends/>
          </div>
        </div>
      ) : (
        <SignIn/>
      )}
    </Layout>
  );
}


export const getServerSideProps: GetServerSideProps<{coinsData: CryptoPrices}> = async () => {

  const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cdai%2Cusd-coin&vs_currencies=mxn%2Cusd")
  const coinsData = await res.json() as CryptoPrices;

  return {
    props: {
      coinsData
    }
  }

}