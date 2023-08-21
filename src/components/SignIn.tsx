import Logo from "public/images/Logo";
import { AccountButton } from "./AccountButton";
import Button from "./Button";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { getPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";
import { SiweMessage } from "siwe";
import { getCsrfToken, signIn } from "next-auth/react";

const PasskeySignIn = () => {
  const { connect } = useConnect({
    onSuccess: () => {
      console.log("Successfully connected");
      void siweSignIn();
    },
  });
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const handleLogin = async () => {
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

  async function siweSignIn() {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in to Woosh",
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
      console.log("Signed In");
    } catch (error) {
      console.error("Sign in error: ", error);
    }
  }

  return (
    <>
      <Button onClick={() => void handleLogin()}>Sign In</Button>
    </>
  );
};

export const SignIn = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4 lg:px-0">
      <div className="w-full md:w-auto">
        <Logo />
        <h1 className="mb-16 mt-4 max-w-[10ch] text-4xl">
          Send crypto to any phone number
        </h1>
        <AccountButton />
        <PasskeySignIn />
      </div>
    </div>
  );
};

export default SignIn;
