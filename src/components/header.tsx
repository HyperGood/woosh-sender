// import QrIcon from "public/images/icons/QrIcon";
import { signOut } from "next-auth/react";
import SettingsIcon from "public/images/icons/SettingsIcon";
import UserPlaceholder from "public/images/icons/UserPlaceholder";

export function Header({ username }: { username?: string }) {
  return (
    <div className="z-50 flex w-full items-center justify-between gap-4 px-4 py-4 lg:absolute lg:top-0 lg:px-10 lg:py-8">
      {/* <div>
        <QrIcon />
      </div> */}
      <div className="flex items-center gap-2">
        <div className="w-10">
          <UserPlaceholder />
        </div>
        <span>{username ? username : "Cool User"}</span>
      </div>
      <div
        onClick={() => void signOut()}
        className="h-6 w-6 cursor-pointer text-brand-black lg:text-brand-white"
      >
        <SettingsIcon />
      </div>
    </div>
  );
}

export default Header;
