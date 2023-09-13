import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { ZeroDevConnector, useSendUserOperation } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";
import Button from "~/components/Button";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { type UseFormRegister } from "react-hook-form";
import { type WooshUser } from "~/models/users";
// import PasskeySignIn from "../PasskeySignIn";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { SiweMessage } from "siwe";
import { LoadingSpinner } from "../Loading";
import { toast } from "react-hot-toast";
// import CustomConnectButton from "../CustomConnectButton";

export const Onboarding = ({
  register,
  setOnboardingComplete,
  sender,
}: {
  register: UseFormRegister<WooshUser>;
  setOnboardingComplete: Dispatch<SetStateAction<boolean>>;
  sender: string;
}) => {
  const [step, setStep] = useState<number>(0);
  const { sendUserOperation } = useSendUserOperation({
    to: "0x0000000000000000000000000000000000000000",
    data: "0x",
    value: BigInt("0"),
    onSuccess(data) {
      console.log(data);
    },
  });
  const { connect, isLoading } = useConnect({
    onSuccess: () => {
      void siweSignIn();
      if (shouldDeployAccount) {
        //deployAccount
        sendUserOperation?.();
      }
    },
    onError: () => {
      setSigningIn(false);
      toast.error("There was an error signing in");
    },
  });
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { data: session } = useSession();
  const { data: userData } = api.user.getUserData.useQuery(undefined, {
    enabled: !!session,
  });
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [shouldDeployAccount, setShouldDeployAccount] = useState(false);

  // const getOrCreateOwner = async () => {
  //   setSigningIn(true);
  //   try {
  //     return getPasskeyOwner({
  //       projectId: env.NEXT_PUBLIC_ZERODEV_ID,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     try {
  //       return await createPasskeyOwner({
  //         projectId: env.NEXT_PUBLIC_ZERODEV_ID,
  //         name: "Woosh",
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  // };

  const passkeySignIn = async () => {
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
  const handleRegister = async () => {
    setShouldDeployAccount(true);
    connect({
      connector: new ZeroDevConnector({
        chains,
        options: {
          projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          owner: await createPasskeyOwner({
            projectId: env.NEXT_PUBLIC_ZERODEV_ID,
            name: "Woosh",
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

  useEffect(() => {
    if (isConnected && session && userData?.name) {
      // setOnboardingComplete(true);
      setStep(1);
    } else {
      setStep(1);
    }
  }, [isConnected, userData, session, setOnboardingComplete]);

  return (
    <div className="flex h-screen flex-col justify-between px-4 py-6">
      <div />
      {isConnected && step === 1 ? (
        <>
          <div>
            <h2 className="my-1 text-3xl">What&apos;s your name?</h2>
            <p className="mb-8 text-lg">
              This is how people will easily find you!
            </p>
            <div className="relative mb-12 flex flex-col justify-center gap-4">
              <input
                type="text"
                className="w-full rounded-full border border-brand-black/20 bg-transparent p-4"
                placeholder="Name"
                {...register("name")}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Button
                disabled={isLoading}
                fullWidth
                onClick={() => setOnboardingComplete(true)}
              >
                Next
              </Button>
            </div>
          </div>
          <div />
        </>
      ) : (
        <>
          <div>
            <span>Takes about 20 seconds</span>
            <h1 className="my-1 text-3xl">{sender} sent you money! 🤑</h1>
            <p className="mb-8 text-lg">
              This is where your funds will be stored!
            </p>
            <div className="flex flex-col gap-4">
              <Button
                fullWidth
                onClick={() => {
                  void handleRegister();
                }}
                loading={signingIn}
              >
                <div className="flex items-center gap-4">
                  {signingIn ? null : "Create Account"}
                  {signingIn ? <LoadingSpinner /> : null}
                </div>
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  void passkeySignIn();
                }}
                loading={signingIn}
                intent="secondary"
              >
                <div className="flex items-center gap-4">
                  {signingIn ? null : "I already have an account"}
                  {signingIn ? <LoadingSpinner /> : null}
                </div>
              </Button>
              {/* <CustomConnectButton /> */}
            </div>
          </div>
          <button className="font-bold underline">What is Woosh?</button>
        </>
      )}
    </div>
  );
};
