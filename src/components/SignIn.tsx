import Logo from "public/images/Logo";

//import CustomConnectButton from "./CustomConnectButton";
import Link from "next/link";
import { buttonStyles } from "./Button";
import PasskeySignIn from "./PasskeySignIn";

export const SignIn = () => {
  return (
    <div className="flex h-screen w-full flex-col justify-between px-2 py-8 lg:items-center lg:px-4">
      <Logo />
      <div className="w-full lg:w-auto">
        <h1 className="mx-auto mb-16 mt-4 max-w-[11ch] text-center text-4xl">
          Pay anyone with just a link
        </h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <PasskeySignIn />
          <Link
            href="/referrals"
            className={buttonStyles({
              intent: "secondary",
              size: "full",
              hover: true,
            })}
          >
            Request Access
          </Link>
        </div>
      </div>
      <div />
    </div>
  );
};

export default SignIn;
