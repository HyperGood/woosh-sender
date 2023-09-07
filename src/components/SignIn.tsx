import Logo from "public/images/Logo";

import CustomConnectButton from "./CustomConnectButton";
import PasskeySignIn from "./PasskeySignIn";

export const SignIn = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4 lg:px-0">
      <div className="w-full md:w-auto">
        <Logo />
        <h1 className="mb-16 mt-4 max-w-[10ch] text-4xl">
          Send crypto to any phone number
        </h1>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <PasskeySignIn />
          <CustomConnectButton />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
