import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { optimismGoerli } from "wagmi/chains";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CryptoPricesProvider } from "~/context/TokenPricesContext";
import { Toaster } from "react-hot-toast";
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { env } from "~/env.mjs";
import {
  RainbowKitSiweNextAuthProvider,
  type GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import "@rainbow-me/rainbowkit/styles.css";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismGoerli],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Woosh",
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Woosh",
});

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider
            chains={chains}
            theme={lightTheme({
              accentColor: "#19181D",
              accentColorForeground: "#C8FD6A",
            })}
          >
            <CryptoPricesProvider>
              <Component {...pageProps} />
              <Toaster position="bottom-right" />
            </CryptoPricesProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </WagmiConfig>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
