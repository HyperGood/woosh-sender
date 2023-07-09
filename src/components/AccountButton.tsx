import { ChainIcon, ConnectKitButton } from "connectkit";
import UserPlaceholder from "public/images/icons/UserPlaceholder";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

export const AccountButton = () => {
  const { disconnect } = useDisconnect();
  const onClickSignOut = async () => {
    await signOut();
    disconnect();
  };
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
            {isConnected ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <div className="bg-brand flex items-center gap-4 rounded-md bg-brand-white px-4 py-2">
                    <UserPlaceholder />
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-lg">
                        {ensName ? ensName : truncatedAddress}
                      </span>
                      {chain && (
                        <div className="flex items-center gap-2">
                          <span className=" opacity-60">Network:</span>
                          <ChainIcon id={chain.id} />
                          <span>{chain.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="mt-2 flex w-[--radix-dropdown-menu-trigger-width] flex-col rounded-md bg-brand-white">
                    <DropdownMenu.Item className=" w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent">
                      <button
                        className="w-full"
                        onClick={() => {
                          if (address) {
                            void navigator.clipboard.writeText(address);
                            toast.success("Address copied!");
                          } else {
                            toast.error("No address found");
                          }
                        }}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span>Copy Address</span>
                          <span className="text-sm opacity-60">
                            {truncatedAddress}
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className=" w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent">
                      <button className="w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span>Edit Profile</span>
                          <span className="text-left text-sm opacity-60">
                            Set username, profile picture, and more
                          </span>
                        </div>
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className=" w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent">
                      <button className="w-full">
                        <div className="flex w-full items-center justify-between gap-1">
                          <span>Preferred Currency</span>
                          <span>🇺🇸 USD</span>
                        </div>
                      </button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className=" w-full rounded-md bg-brand-white p-4 transition-colors hover:bg-brand-accent">
                      <button
                        className="w-full text-left"
                        onClick={() => void onClickSignOut()}
                      >
                        Sign Out
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <button
                onClick={show}
                className="w-full rounded-full bg-brand-black py-4 text-brand-white transition-colors hover:bg-brand-accent hover:text-brand-black"
                disabled={isConnected || isConnecting}
              >
                {isConnected || isConnecting
                  ? "Signing In"
                  : "Sign In With Wallet"}
              </button>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
