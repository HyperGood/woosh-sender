import { useContext, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
  type CryptoPrices,
  CryptoPricesContext,
} from "~/context/TokenPricesContext";
import Header from "~/components/Header";
import { ConnectKitButton } from "connectkit";
import Button from "~/components/Button";
import { useRouter } from "next/router";

const Main = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      setSecret("");
      void router.push("/");
    },
  });
  const [secret, setSecret] = useState<string>("");
  return (
    <div>
      <div>
        <h1 className="mb-4 text-4xl font-bold">Claim your tokens</h1>
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
          </div>
        ) : (
          <ConnectKitButton />
        )}
      </div>
    </div>
  );
};

export default function Home({ coinsData }: { coinsData: CryptoPrices }) {
  const { setCryptoPrices } = useContext(CryptoPricesContext);

  if (coinsData) {
    setCryptoPrices(coinsData);
  }

  return (
    <main>
      <div className="relative h-full min-h-screen w-full lg:grid lg:h-screen lg:grid-cols-[1fr_44%] lg:items-center">
        <Header noAccountButton />
        <div className="lg:mx-auto">
          <Main />
        </div>
      </div>
    </main>
  );
}
