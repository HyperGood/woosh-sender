import { getCsrfToken, signIn, useSession } from "next-auth/react";
import Logo from "public/images/Logo";
import { useEffect } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { AccountButton } from "./AccountButton";

export const SignIn = () => {
  // Hooks
  const { data: sessionData } = useSession();
  // Wagmi Hooks
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();

  // Functions
  /**
   * Attempts SIWE and establish session
   */
  const onClickSignIn = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        // nonce is used from CSRF token
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      void signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    if (isConnected && !sessionData) {
      void onClickSignIn();
    }
  }, [isConnected]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-6 lg:px-0">
      <div>
        <Logo />
        <h1 className="mb-16 mt-4 max-w-[10ch] text-4xl">
          Send crypto to any phone number
        </h1>
        <AccountButton />
      </div>
    </div>
  );
};

export default SignIn;
