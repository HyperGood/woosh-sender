import type { Transaction } from "@prisma/client";
import {  signOut, useSession } from "next-auth/react";
import { useContext } from "react";
import {
  useAccount,
  useBalance,
  useDisconnect,
} from "wagmi";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import SignIn from "~/components/SignIn";
import Button from "~/components/Button";
import Image from "next/image";
import type { GetServerSideProps } from "next";
import { type CryptoPrices, CryptoPricesContext } from "~/context/TokenPricesContext";
import Send from "~/components/Send/Send";
import Divider from "~/components/Divider";
import Contacts from "~/components/Contacts";

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
      <Send/>
      <Button fullWidth>Send To An ETH Address</Button>
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