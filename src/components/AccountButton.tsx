import { ChainIcon, ConnectKitButton } from "connectkit";
import UserPlaceholder from "public/images/icons/UserPlaceholder";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDisconnect } from "wagmi";
import { toast } from "react-hot-toast";
import CopyIcon from "public/images/icons/CopyIcon";
import Button from "./Button";
import { useEffect } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";

export const AccountButton = () => {
  const onClickSignOut = () => {
    void signOut({ redirect: false });
    disconnect();
  };
  // Hooks
  const { data: sessionData } = useSession();
  // Wagmi Hooks
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({
    onError(error) {
      if (error.name === "UserRejectedRequestError") {
        toast.error(
          "Sign in cancelled. You must accept the sign in using your wallet."
        );
        disconnect();
      } else {
        toast.error("There was an error signing in. Please try again.");
        console.error("Error signing in: ", error);
      }
    },
  });
  const { address, isConnected } = useAccount();

  // Functions
  /**
   * Attempts SIWE and establish session
   */
  async function onClickSignIn() {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        // nonce is used from CSRF token
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      void signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isConnected && !sessionData) {
      void onClickSignIn();
    }
  }, [isConnected, sessionData]);

  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        isConnecting,
        show,
        truncatedAddress,
        ensName,
        chain,
        address,
      }) => {
        return (
          <>
            {isConnected && sessionData ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <div className="bg-brand flex items-center gap-4 rounded-md bg-brand-white px-4 py-2 ">
                    <UserPlaceholder />
                    <div className="flex flex-col items-start gap-1">
                      <span>{ensName ? ensName : truncatedAddress}</span>
                      {chain && (
                        <div className="flex items-center gap-2 text-sm ">
                          <span className="opacity-60">Network:</span>
                          <ChainIcon size="1rem" id={chain.id} />
                          <span>{chain.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="mt-2 flex w-[--radix-dropdown-menu-trigger-width] flex-col rounded-md bg-brand-white shadow">
                    <DropdownMenu.Item asChild>
                      <button
                        className=" w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent"
                        onClick={() => {
                          if (address) {
                            void navigator.clipboard.writeText(address);
                            toast.success("Address copied!");
                          } else {
                            toast.error("No address found");
                          }
                        }}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <span>Copy Address</span>
                            <span className="text-sm opacity-60">
                              {truncatedAddress}
                            </span>
                          </div>
                          <div className="h-6 w-6">
                            <CopyIcon />
                          </div>
                        </div>
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="hidden w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent"
                      disabled
                    >
                      <button className="w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span>Edit Profile</span>
                          <span className="text-left text-sm opacity-60">
                            Set username, profile picture, and more
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className=" hidden w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent"
                      disabled
                    >
                      <button className="w-full">
                        <div className="flex w-full items-center justify-between gap-1">
                          <span>Preferred Currency</span>
                          <span className="font-polysans">🇺🇸 USD</span>
                        </div>
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => void onClickSignOut()}
                        className=" w-full rounded-md bg-brand-white p-4 text-left transition-colors hover:bg-brand-accent"
                      >
                        Sign Out
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Button
                onClick={show}
                intent="secondary"
                fullWidth
                disabled={isConnecting}
              >
                {isConnecting ? "Signing in..." : "Sign In With Wallet"}
              </Button>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
