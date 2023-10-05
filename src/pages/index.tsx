import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import SignIn from "~/components/SignIn";
import type { GetServerSideProps } from "next";
import {
  type TokenPrices,
  TokenPricesContext,
} from "~/context/TokenPricesContext";
import Send from "~/components/Send/Send";
import { PreviousSends } from "~/components/Transactions";
import Header from "~/components/header";
import { api } from "~/utils/api";
import TotalBalance from "~/components/Balance/TotalBalance";
import { UserBalancesContext } from "~/context/UserBalanceContext";
import { outAddress } from "~/lib/erc-20/opg-out";
import { usdcAddress } from "~/lib/erc-20/op-usdc";
import { env } from "~/env.mjs";
import Button from "~/components/Button";
import WithdrawIcon from "public/images/icons/WithdrawIcon";
import TokensList from "~/components/Balance/TokensList";

export default function Home({ tokensData }: { tokensData: TokenPrices }) {
  const { setTokenPrices } = useContext(TokenPricesContext);
  const { setUserBalances } = useContext(UserBalancesContext);

  const { isConnected, address } = useAccount();
  const { data: session } = useSession();
  const { data: userData } = api.user.getUserData.useQuery(undefined, {
    enabled: !!session,
  });
  const { data: ethBalance } = useBalance({
    address: address,
  });
  const { data: usdcBalance, isLoading } = useBalance({
    address: address,
    token: env.NEXT_PUBLIC_TESTNET === "true" ? outAddress : usdcAddress,
  });

  useEffect(() => {
    setTokenPrices(tokensData);
  }, [tokensData, setTokenPrices]);


  useEffect(() => {
    if (address && !isLoading) {
      setUserBalances([
        {
          token: "ETH",
          tokenName: "ethereum",
          balance: Number(ethBalance?.formatted) || 0,
        },
        {
          token: "USDc",
          tokenName: "usd-coin",
          balance: Number(usdcBalance?.formatted) || 0,
        },
      ]);
    } else {
      console.log("Address: ", address);
    }
  }, [setUserBalances, usdcBalance, ethBalance, address, isLoading]);

  return (
    <main>
      {isConnected && session ? (
        <div className="relative h-full min-h-screen w-full lg:grid lg:h-screen lg:grid-cols-[1fr_44%] lg:items-center">
          <Header
            username={userData?.name === null ? undefined : userData?.name}
            address={address || "0xnoaddress"}
          />
          <div className="lg:mx-auto">
            <div className="mt-20 flex flex-col items-center  px-4 lg:mt-0 lg:min-w-[500px] lg:max-w-[50vw] lg:px-0">
              <TotalBalance />
              <div className="mb-12 flex w-full gap-8 lg:mb-0 lg:mt-14">
                <Button intent="secondary" size="full">
                  <div className="flex items-center gap-2">
                    <WithdrawIcon />
                    <span>Withdraw</span>
                  </div>
                </Button>
                <Send />
              </div>
              <TokensList />
            </div>
          </div>
          <div className=" h-full max-h-screen w-full  gap-20 overflow-hidden rounded-t-xl bg-[#E9EBEA] px-4 pb-20 pt-10 lg:px-8 lg:pb-2 lg:pt-40">
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
  tokensData: TokenPrices;
}> = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cusd-coin&vs_currencies=mxn%2Cusd"
  );
  const tokensData = (await res.json()) as TokenPrices;

  return {
    props: {
      tokensData,
    },
  };
};
