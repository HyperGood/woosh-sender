import Logo from "public/images/Logo";

//import CustomConnectButton from "./CustomConnectButton";
import PasskeySignIn from "./PasskeySignIn";

export const SignIn = () => {
  return (
    <div className="flex h-screen w-full flex-col justify-between px-2 py-8 lg:items-center lg:px-4">
      <Logo />
      <div className="w-full lg:w-auto">
        <h1 className="mb-16 mt-4 max-w-[11ch] text-center text-4xl">
          Pay anyone with just a link
        </h1>
        <PasskeySignIn />
      </div>
      <div />
    </div>
  );
};

export default SignIn;
