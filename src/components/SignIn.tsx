import Logo from "public/images/Logo";

import CustomConnectButton from "./CustomConnectButton";
import PasskeySignIn from "./PasskeySignIn";

export const SignIn = () => {
  return (
    <div className="flex h-screen w-full flex-col justify-between px-2 py-8 lg:px-0">
      <Logo />
      <div className="w-full md:w-auto">
        <h1 className="mb-16 mt-4 max-w-[10ch] text-4xl">
          Send funds to anyone, even if they don&apos;t have a wallet
        </h1>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <PasskeySignIn />
          {/* <CustomConnectButton /> */}
        </div>
      </div>
      <div />
    </div>
  );
};

export default SignIn;
