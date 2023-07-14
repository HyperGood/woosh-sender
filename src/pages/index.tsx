import type { Transaction } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { api } from "~/utils/api";
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
import CancelDepositButton from "~/components/DepositVault/CancelDepositButton";
import SendToWallet from "~/components/Send/Wallet/SendToWallet";
import Header from "~/components/header";
import SignDepositButton from "~/components/DepositVault/SignDepositButton";
import { makePhoneReadable } from "~/lib/formatPhone";
import * as Dialog from "@radix-ui/react-dialog";
import TransactionInfo from "~/components/Send/TransactionInfo";
import { toast } from "react-hot-toast";
import CopyIcon from "public/images/icons/CopyIcon";
import Button from "~/components/Button";

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
    {
      token: "DAI",
      tokenName: "dai",
      balance: 200,
    },
    {
      token: "USDC",
      tokenName: "usd-coin",
      balance: 800,
    },
  ];

  console.log(userBalances);

  if (ethBalanceLoading) return <p>Loading...</p>;
  if (ethBalanceError) {
    console.log("balanceError: ", ethBalanceError);
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
    <div>
      <p className="mb-8 mt-4 text-4xl">
        {totalBalance.toLocaleString("en-us", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <Balance
        token="ETH"
        tokenName="ethereum"
        balance={Number(ethBalance?.formatted) || 0}
      />
      <Divider />
      <Balance token="USDC" tokenName="usd-coin" balance={800} />
      <Divider />
      <Balance token="DAI" tokenName="dai" balance={200} />
    </div>
  );
};

const Main = () => {
  return (
    <div className="mt-20 px-4 lg:mt-0 lg:px-0">
      <span className="block font-polysans text-lg">welcome</span>
      <span className="block font-polysans text-2xl">roysandoval.eth</span>
      <Balances />
      <div className="my-12 flex flex-col gap-8 lg:mb-0 lg:mt-14">
        <SendToPhone />
        <SendToWallet />
      </div>
    </div>
  );
};

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [clicked, setClicked] = useState(false);
  const [secret, setSecret] = useState("");
  const phone = makePhoneReadable(transaction.phone || "");
  const url = `http://localhost:3000/claim/${transaction.id}`;
  const [open, setOpen] = useState(false);
  console.log(transaction.nonce);

  const SecretDialog = () => (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 flex w-[640px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl bg-brand-white px-4 py-8 shadow">
          <Dialog.Title className="text-2xl">Transaction Secret</Dialog.Title>
          <TransactionInfo
            label="Claim Link"
            content={
              <div className="flex items-center justify-between gap-4">
                <p className="break-all text-lg ">{url}</p>
                <div
                  onClick={() => {
                    void navigator.clipboard.writeText(url);
                    toast.success("Claim link copied!");
                  }}
                  className="h-7 w-7 shrink-0 cursor-pointer"
                >
                  <CopyIcon />
                </div>
              </div>
            }
          />
          <TransactionInfo
            label="Secret"
            content={
              <div className="flex items-center justify-between gap-4">
                <p className="break-all text-lg ">{secret}</p>
                <div
                  onClick={() => {
                    void navigator.clipboard.writeText(secret);
                    toast.success("Secret copied!");
                  }}
                  className="h-7 w-7 shrink-0 cursor-pointer"
                >
                  <CopyIcon />
                </div>
              </div>
            }
          />

          <Dialog.Close className="mt-8">
            <Button fullWidth intent="secondary">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  useEffect(() => {
    if (secret) {
      setOpen(true);
    }
  }, [secret]);

  return (
    <div className="flex flex-col rounded-md bg-[#F1F3F2] px-4 py-5 text-brand-black">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {transaction.contact ? (
              <>
                <span className="font-polysans">{transaction.contact}</span>
                <span className="opacity-60">
                  {!transaction.address ? phone : transaction.address}
                </span>
              </>
            ) : (
              <span className="font-polysans">
                {!transaction.address ? phone : transaction.address}
              </span>
            )}
          </div>
          {transaction.type === "phone" ? (
            <span className="opacity-60">
              {transaction.claimed ? "Claimed" : "Unclaimed"}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="font-polysans">
            {transaction.amount} {transaction.token}
          </div>
          <span className="opacity-60">
            {transaction.amountInUSD.toLocaleString("en-us", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
      </div>
      {transaction.type === "phone" ? (
        <div className="mt-6 flex w-full items-center justify-between">
          {transaction.claimed ? null : (
            <div
              onClick={() => {
                setClicked(!clicked);
              }}
            >
              <CancelDepositButton
                transaction={transaction}
                clicked={clicked}
              />
            </div>
          )}
          {!transaction.claimed ? (
            <div
              onClick={() => {
                if (secret && !open) setOpen(true);
              }}
              className="opacity-80 hover:opacity-100"
            >
              <SignDepositButton
                transaction={transaction}
                setSecret={setSecret}
                nonce={BigInt(transaction.nonce || 0)}
                secret={secret}
                card
              />
            </div>
          ) : null}
        </div>
      ) : null}
      <SecretDialog />
    </div>
  );
};

const PreviousSends = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.transaction.getAllTransactionsByUser.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) return <div>Oh no, something went horribly wrong!😟</div>;

  return (
    <>
      <div className="h-full">
        <p className="mb-5 font-polysans text-lg ">
          previous sends ({data.length})
        </p>
        {data.length !== 0 ? (
          <div className=" flex h-full flex-col gap-5 overflow-auto  pb-20">
            {data.map((transaction: Transaction) => (
              <div key={transaction.id} className="w-full">
                <TransactionCard transaction={transaction} />
              </div>
            ))}
            {data.length > 6 && (
              <span className="mt-2 text-center opacity-60">
                That&apos;s all of them!
              </span>
            )}
          </div>
        ) : (
          <span className="opacity-60">
            Once you send funds the transactions will be here!
          </span>
        )}
      </div>
    </>
  );
};

export default function Home({ coinsData }: { coinsData: CryptoPrices }) {
  const { setCryptoPrices } = useContext(CryptoPricesContext);
  const { isConnected } = useAccount();

  const { data: session } = useSession();

  if (coinsData) {
    setCryptoPrices(coinsData);
  }

  useEffect(() => {
    if (!isConnected && session) {
      void signOut();
    }
  }, [isConnected]);

  return (
    <main>
      {isConnected && session ? (
        <div className="relative h-full min-h-screen w-full lg:grid lg:h-screen lg:grid-cols-[1fr_44%] lg:items-center">
          <Header />
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
