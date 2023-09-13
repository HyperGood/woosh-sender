// import QrIcon from "public/images/icons/QrIcon";
import UserPlaceholder from "public/images/icons/UserPlaceholder";
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
      {/* <div>
        <QrIcon />
      </div> */}
      <div className="flex items-center gap-2">
        <div className="w-10">
          <UserPlaceholder />
        </div>
        <span>{username ? username : "Cool User"}</span>
      </div>
      <UserMenu address={address} />
    </div>
  );
}

export default Header;
