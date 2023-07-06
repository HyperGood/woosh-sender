import { ConnectKitButton } from "connectkit";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage, useDisconnect } from "wagmi";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  // Hooks
  const { data: sessionData } = useSession();
  // Wagmi Hooks
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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

  /**
   * Sign user out
   */
  const onClickSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (isConnected && !sessionData) {
      void onClickSignIn();
    } else if (!isConnected && sessionData) {
      void onClickSignOut();
    }
  }, [isConnected]);

  // Render
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ConnectKitButton />
      {sessionData && isConnected ? (
        <>
          <div>You are signed in!</div>
          <button
            onClick={(e) => {
              e.preventDefault();
              void onClickSignOut();
              disconnect();
            }}
          >
            Sign Out
          </button>
        </>
      ) : null}
    </div>
  );
}
