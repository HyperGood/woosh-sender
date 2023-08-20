import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
// import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { optimismGoerli } from "wagmi/chains";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CryptoPricesProvider } from "~/context/TokenPricesContext";
import { Toaster } from "react-hot-toast";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { env } from "~/env.mjs";
import {
  RainbowKitSiweNextAuthProvider,
  type GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import "@rainbow-me/rainbowkit/styles.css";

// const chains = [optimismGoerli];

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
// const config = createConfig(
//   getDefaultConfig({
//     chains,
//     alchemyId: env.NEXT_PUBLIC_ALCHEMY_ID, // or infuraId
//     walletConnectProjectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,

//     // Required
//     appName: "Woosh",
//     autoConnect: false,
//     connectors: connectors,

//     // Optional
//     appDescription:
//       "Send crypto to your friends and family even if they don't have a wallet",
//     // appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
//   })
// );

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
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

{
  /* <ConnectKitProvider
customTheme={{
  "--fhOscard-font-family": '"FH Oscar", sans-serif',
  "--ck-connectbutton-border-radius": "100vw",
  "--ck-connectbutton-background": "19181D",
  "--ck-connectbutton-color": "F9FBFA",
  "--ck-connectbutton-hover-background": "C8FD6A",
  "--ck-connectbutton-hover-color": "19181D",
}}
> */
}
