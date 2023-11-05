import PlusIcon from "public/images/icons/PlusIcon";
import Button from "./Button";
import UserMenu from "./UserMenu";
import { Drawer } from "vaul";
import { GateFiDisplayModeEnum, GateFiSDK } from "@gatefi/js-sdk";
import { useEffect, useState } from "react";

export function Header({
  username,
  address,
}: {
  username?: string;
  address: `0x${string}`;
}) {
  const [onRamp, setOnRamp] = useState<GateFiSDK | null>(null);
  const [open, setOpen] = useState<boolean>(true);

  const handleOnRamp = () => {
    setOpen(false);
    setOnRamp(
      new GateFiSDK({
        merchantId: "f017f0a9-cf0e-4b55-989b-60fd82b511df",
        displayMode: GateFiDisplayModeEnum.Embedded,
        nodeSelector: "#container",
      })
    );
  };

  useEffect(() => {
    if (onRamp) {
      onRamp.show();
    }
  }, [onRamp]);
  return (
    <>
      <div className="z-50 flex w-full items-center justify-between gap-4 px-4 py-4 lg:absolute lg:top-0 lg:px-10 lg:py-8">
        <UserMenu address={address} username={username} />
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Trigger>
            <Button size="small" intent="accent">
              <div className="flex items-center gap-2 text-[#1FAE47]">
                <PlusIcon />
                Add Funds
              </div>
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[316px] flex-col rounded-t-[32px] bg-zinc-100">
              <div className="flex-1 rounded-t-[10px] rounded-t-[32px] bg-white p-4">
                <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
                <div className="mx-auto max-w-md">
                  <Drawer.Title className="mb-8 w-full text-center text-2xl">
                    Add Funds
                  </Drawer.Title>
                  <div className="mb-4">
                    <Button size="full" onClick={handleOnRamp}>
                      Buy Funds
                    </Button>
                  </div>
                  <div>
                    <Button size="full" intent={"outline"}>
                      Deposit on Optimism
                    </Button>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <div className="relative mt-10 flex w-full justify-center">
        <div
          id="container"
          className="absolute right-0 top-0 flex h-full w-full justify-center"
        ></div>
      </div>
    </>
  );
}

export default Header;
