import PlusIcon from "public/images/icons/PlusIcon";
import Button from "./Button";
import UserMenu from "./UserMenu";

export function Header({
  username,
  address,
}: {
  username?: string;
  address: `0x${string}`;
}) {
  return (
    <div className="z-50 flex w-full items-center justify-between gap-4 px-4 py-4 lg:absolute lg:top-0 lg:px-10 lg:py-8">
      <UserMenu address={address} username={username} />
      <Button size="small" intent="accent" disabled>
        <div className="flex items-center gap-2 text-[#1FAE47]">
          <PlusIcon />
          <span>Add Funds</span>
        </div>
      </Button>
    </div>
  );
}

export default Header;
