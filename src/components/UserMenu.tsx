import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { useDisconnect } from "wagmi";
import CopyIcon from "public/images/icons/CopyIcon";
import PixelChevron from "public/images/icons/pixel-chevron";

/*
  TO-DO
    - Chevron animation. Durn down on click
*/

export const UserMenu = ({
  address,
  username,
}: {
  address: `0x${string}`;
  username?: string;
}) => {
  const { disconnect } = useDisconnect();
  const onClickSignOut = () => {
    disconnect();
    void signOut({ redirect: false });
  };

  let truncatedAddress;
  if (address)
    truncatedAddress = address?.slice(0, 4) + "..." + address?.slice(-4);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {/* <div className="bg-brand flex items-center gap-4 rounded-md bg-brand-white px-4 py-2 ">
          <UserPlaceholder />
          <div className="flex flex-col items-start gap-1">
            <span>{username}</span> */}
        {/* {chain && (
              <div className="flex items-center gap-2 text-sm ">
                <span className="opacity-60">Network:</span>
                <ChainIcon size="1rem" id={chain.id} />
                <span>{chain.name}</span>
              </div>
            )} */}
        {/* </div>
        </div> */}
        <div className="flex items-center gap-2">
          <span>{username ? username : "User"}</span>
          <PixelChevron />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 flex flex-col rounded-md bg-brand-white shadow">
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
                  <span className="text-sm opacity-60">{truncatedAddress}</span>
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
  );
};

export default UserMenu;
