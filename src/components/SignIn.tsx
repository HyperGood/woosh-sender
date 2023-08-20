import Logo from "public/images/Logo";
import { AccountButton } from "./AccountButton";
import Button from "./Button";
import { useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { getPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";
// import Link from "next/link";

export const SignIn = () => {
  const { connect } = useConnect();
  const handleLogin = async () => {
    console.log("logging in");
    connect({
      connector: new ZeroDevConnector({
        chains,
        options: {
          projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          owner: await getPasskeyOwner({
            projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          }),
        },
      }),
    });
  };
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4 lg:px-0">
      <div className="w-full md:w-auto">
        <Logo />
        <h1 className="mb-16 mt-4 max-w-[10ch] text-4xl">
          Send crypto to any phone number
        </h1>
        <AccountButton />
        <Button onClick={() => void handleLogin()}>Sign In</Button>
        {/* <Link
          href="/claim"
          className="mt-8 block rounded-md bg-brand-gray-light p-2 text-center underline hover:bg-brand-accent"
        >
          Claim Funds
        </Link> */}
      </div>
    </div>
  );
};

export default SignIn;
