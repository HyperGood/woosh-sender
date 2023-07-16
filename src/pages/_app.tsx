import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { hardhat, optimismGoerli } from "wagmi/chains";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CryptoPricesProvider } from "~/context/TokenPricesContext";
import { Toaster } from "react-hot-toast";

const chains = [optimismGoerli, hardhat];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    chains,
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",

    // Required
    appName: "Woosh",
    autoConnect: false,

    // Optional
    appDescription:
      "Send crypto to your friends and family even if they don't have a wallet",
    // appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <WagmiConfig config={config}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ConnectKitProvider
          customTheme={{
            "--fhOscard-font-family": '"FH Oscar", sans-serif',
            "--ck-connectbutton-border-radius": "100vw",
            "--ck-connectbutton-background": "19181D",
            "--ck-connectbutton-color": "F9FBFA",
            "--ck-connectbutton-hover-background": "C8FD6A",
            "--ck-connectbutton-hover-color": "19181D",
          }}
        >
          <CryptoPricesProvider>
            <Component {...pageProps} />
            <Toaster position="bottom-right" />
          </CryptoPricesProvider>
        </ConnectKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
