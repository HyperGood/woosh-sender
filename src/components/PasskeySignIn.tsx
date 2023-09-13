import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { getCsrfToken, signIn } from "next-auth/react";
import Button from "./Button";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { getPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";

export const PasskeySignIn = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect({
    onSuccess: () => {
      void siweSignIn();
    },
  });

  const handleLogin = async () => {
    if (isConnected) {
      console.log("siwe");
      void siweSignIn();
    } else {
      try {
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
      } catch (error) {
        console.log("error: ", error);
      }
    }
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

export default PasskeySignIn;
