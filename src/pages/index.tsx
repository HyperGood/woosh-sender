import { signOut, useSession } from "next-auth/react";
import { Fragment, useContext, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import SignIn from "~/components/SignIn";
import Image from "next/image";
import type { GetServerSideProps } from "next";
import {
  type CryptoPrices,
  CryptoPricesContext,
} from "~/context/TokenPricesContext";
import SendToPhone from "~/components/Send/Phone/SendToPhone";
import Divider from "~/components/Divider";
import Contacts from "~/components/Contacts";
import { PreviousSends } from "~/components/Transactions";
import SendToWallet from "~/components/Send/Wallet/SendToWallet";
import Header from "~/components/header";
import { api } from "~/utils/api";
import { outAddress } from "~/lib/erc-20/opg-out";
import { env } from "~/env.mjs";
import { usdcAddress } from "~/lib/erc-20/op-usdc";

const Balances = () => {
  const { cryptoPrices } = useContext(CryptoPricesContext);
  const { address } = useAccount();
  const {
    data: ethBalance,
    isError: ethBalanceError,
    isLoading: ethBalanceLoading,
  } = useBalance({
    address: address,
  });
  const {
    data: usdcBalance,
    isError: usdcBalanceError,
    isLoading: usdcBalanceLoading,
  } = useBalance({
    address: address,
    token: env.NEXT_PUBLIC_TESTNET === "true" ? outAddress : usdcAddress,
  });

  interface UserBalance {
    token: string;
    tokenName: "ethereum" | "dai" | "usd-coin";
    balance: number;
  }

  const userBalances: UserBalance[] = [
    {
      token: "ETH",
      tokenName: "ethereum",
      balance: Number(ethBalance?.formatted) || 0,
    },
    // {
    //   token: "DAI",
    //   tokenName: "dai",
    //   balance: 200,
    // },
    {
      token: "USDC",
      tokenName: "usd-coin",
      balance: Number(usdcBalance?.formatted) || 0,
    },
  ];

  if (ethBalanceLoading || usdcBalanceLoading)
    return (
      <span
        className="inline-block h-5 w-full animate-pulse rounded-sm bg-brand-gray-medium "
        style={{ animationDelay: "0.05s", animationDuration: "1s" }}
      />
    );
  if (ethBalanceError) {
    console.log("ETH balanceError: ", ethBalanceError);
  }
  if (usdcBalanceError) {
    console.log("USDC balanceError: ", usdcBalanceError);
  }

  let totalBalance = 0;

  if (ethBalance && cryptoPrices) {
    for (const userBalance of userBalances) {
      if (cryptoPrices[userBalance.tokenName]?.usd) {
        totalBalance +=
          userBalance.balance * cryptoPrices[userBalance.tokenName]?.usd;
      }
    }
  }

  const Balance = ({
    token,
    balance,
    tokenName,
  }: {
    token: string;
    balance: number;
    tokenName: "ethereum" | "usd-coin" | "dai";
  }) => {
    const { cryptoPrices } = useContext(CryptoPricesContext);
    let balanceInUSD = 0;
    if (cryptoPrices?.[tokenName]?.usd) {
      balanceInUSD = balance * cryptoPrices?.[tokenName]?.usd;
    }
    return (
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <Image
            src={`/images/tokens/${token}.svg`}
            width={16}
            height={16}
            alt={token}
            className="h-4 w-4 object-contain"
          />
          <span>{balance} </span>

          <span>{token}</span>
        </div>
        <span>
          {balanceInUSD.toLocaleString("en-us", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full">
      <p className="mb-8 mt-4 text-center text-4xl">
        {totalBalance.toLocaleString("en-us", {
          style: "currency",
          currency: "USD",
        })}
      </p>{" "}
      <Divider />
      {userBalances.map((userBalance) => (
        <Fragment key={userBalance.token}>
          <Balance
            token={userBalance.token}
            tokenName={userBalance.tokenName}
            balance={userBalance.balance}
          />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

const Main = () => {
  return (
    <div className="mt-20 flex flex-col items-center  px-4 lg:mt-0 lg:min-w-[500px] lg:max-w-[50vw] lg:px-0">
      <span className="block font-polysans text-lg">Balance</span>
      <Balances />
      <div className="my-12 flex w-full flex-col gap-8 lg:mb-0 lg:mt-14">
        <SendToPhone />
        <SendToWallet />
      </div>
    </div>
  );
};

export default function Home({ coinsData }: { coinsData: CryptoPrices }) {
  const { setCryptoPrices } = useContext(CryptoPricesContext);
  const { isConnected, address } = useAccount();
  // const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const { data: userData } = api.user.getUserData.useQuery(undefined, {
    enabled: !!session,
  });

  useEffect(() => {
    setCryptoPrices(coinsData);
  }, [coinsData, setCryptoPrices]);

  useEffect(() => {
    if (userData?.address !== address) {
      //TO-DO: This should be an alert first
      void signOut({ redirect: false });
    }
  }, [address, session, userData?.address]);

  useEffect(() => {
    if (!isConnected && session) {
      console.log("There is a session, but no wallet connected. Signing Out");
      // void signOut({ redirect: false });
      // console.log("Signed Out");
    } else if (isConnected && !session) {
      console.log("Wallet Connected. No session.");
    } else if (isConnected && session) {
      console.log("Wallet Connected. Session exists. Signed In");
    }
  }, [isConnected, session]);

  return (
    <main>
      {isConnected && session ? (
        <div className="relative h-full min-h-screen w-full lg:grid lg:h-screen lg:grid-cols-[1fr_44%] lg:items-center">
          <Header
            username={userData?.name === null ? undefined : userData?.name}
            address={address || "0xnoaddress"}
          />
          <div className="lg:mx-auto">
            <Main />
          </div>
          <div className="grid h-full max-h-screen w-full grid-cols-1 grid-rows-2 gap-20 overflow-hidden bg-brand-black px-4 pb-20 pt-20 text-brand-white lg:px-8 lg:pb-2 lg:pt-40">
            <Contacts />
            <PreviousSends />
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{
  coinsData: CryptoPrices;
}> = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cdai%2Cusd-coin&vs_currencies=mxn%2Cusd"
  );
  const coinsData = (await res.json()) as CryptoPrices;

  return {
    props: {
      coinsData,
    },
  };
};

//number tool three crowd menu screen crop alcohol mind tent wife unveil
