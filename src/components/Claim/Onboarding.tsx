import { useAccount, useConnect } from "wagmi";
import { ZeroDevConnector, useSendUserOperation } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";
import Button from "~/components/Button";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type UseFormRegister } from "react-hook-form";
import { type WooshUser } from "~/models/users";
// import PasskeySignIn from "../PasskeySignIn";
import { LoadingSpinner } from "../Loading";
import { toast } from "react-hot-toast";
// import CustomConnectButton from "../CustomConnectButton";

/**
 * User creates account (FaceID)
 * We deploy the account sending a user op (FaceID)
 * Then the user sets their name; We ask for it here to show the sender who claimed the funds
 * On claim there's another (FaceID) confirmation
 * And then we make you sign in again (FaceID)
 * 5 needs to get reduced to 1
 */

/**
 * SESSION KEYS
 * 1. Generate a key - This one will have the permissiones
 * 2. Sign the key & its scope with master key - Passkey signs master key
 * 3. Use the session key
 */

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

  const { sendUserOperation: deployAccount } = useSendUserOperation({
    to: "0x0000000000000000000000000000000000000000",
    data: "0x",
    value: BigInt("0"),
    onSuccess(data) {
      console.log("User Op Data:", data);
      setStep(1);
    },
  });

  //On success deploy account
  const { connect, isLoading } = useConnect({
    onSuccess: () => {
      if (shouldDeployAccount) {
        toast.success("Account created and connected");
        toast.success("Deploying account");
        console.log("Deploying account");
        deployAccount?.();
      } else {
        toast.success("Account connected");
        setStep(1);
      }
    },
    onError: () => {
      setSigningIn(false);
      toast.error("There was an error signing in");
    },
  });

  const { isConnected } = useAccount();
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [shouldDeployAccount, setShouldDeployAccount] = useState(false);

  /*
const getOrCreateOwner = async () => {
    setSigningIn(true);
    try {
      return getPasskeyOwner({
        projectId: env.NEXT_PUBLIC_ZERODEV_ID,
      });
    } catch (e) {
      console.log(e);
      try {
        return await createPasskeyOwner({
          projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          name: "Woosh",
        });
      } catch (e) {
        console.error(e);
      }
    }
  };
*/

  //Sign In
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

  //Create Account
  const handleRegister = async () => {
    setShouldDeployAccount(true);
    setSigningIn(true);
    console.log("Creating ZeroDev account");
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
                size="full"
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
            <h1 className="my-1 text-3xl">{sender} sent you money! 🤑</h1>
            <p className="mb-8 text-lg">
              This is where your funds will be stored!
            </p>
            <div className="flex flex-col gap-4">
              <Button
                size="full"
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
                size="full"
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
