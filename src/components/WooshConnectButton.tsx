import { ConnectKitButton } from "connectkit";

export const WooshConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <button onClick={show} className="w-full bg-brand-black text-brand-white hover:bg-brand-accent hover:text-brand-black transition-colors py-4 rounded-full">
            {isConnected ? address : "Sign In With Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};