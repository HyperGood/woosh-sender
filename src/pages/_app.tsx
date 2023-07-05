import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { SIWESession } from "connectkit";
import { optimismGoerli } from "wagmi/chains";
import { siweClient } from "~/utils/siweClient";
const chains = [optimismGoerli];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    chains,
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig config={config}>
      <siweClient.Provider
        onSignIn={(data?: SIWESession) => {
          console.log("onSignIn Provider", data);
        }}
        onSignOut={() => {
          console.log("onSignOut Provider");
        }}
      >
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </siweClient.Provider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
