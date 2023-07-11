import Logo from "public/images/Logo";
import { AccountButton } from "./AccountButton";

export default function Header({
  noAccountButton,
}: {
  noAccountButton?: boolean;
}) {
  return (
    <div className="z-50 flex w-full items-center justify-between gap-4 px-4 py-4 lg:absolute lg:top-0 lg:px-10 lg:py-8">
      <Logo />
      <div>{!noAccountButton && <AccountButton />}</div>
    </div>
  );
}
