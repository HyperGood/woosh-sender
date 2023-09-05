import { useAccount, useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";
import StepIndicator from "~/components/Form/StepIndicator";
import Button from "~/components/Button";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { type UseFormRegister } from "react-hook-form";
import { type WooshUser } from "~/models/users";
// import PasskeySignIn from "../PasskeySignIn";
import { useSession } from "next-auth/react";
// import CustomConnectButton from "../CustomConnectButton";

export const Onboarding = ({
  register,
  validateField,
  setOnboardingComplete,
}: {
  validateField: (args0: "name" | "phone") => Promise<void>;
  register: UseFormRegister<WooshUser>;
  setOnboardingComplete: Dispatch<SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState<number>(0);
  const { connect, isLoading } = useConnect();
  const { isConnected } = useAccount({ onConnect: () => setStep(1) });
  const { data: session } = useSession();

  const getOrCreateOwner = async () => {
    try {
      return getPasskeyOwner({
        projectId: env.NEXT_PUBLIC_ZERODEV_ID,
      });
    } catch (e) {
      console.log(e);
      return await createPasskeyOwner({
        projectId: env.NEXT_PUBLIC_ZERODEV_ID,
        name: "Woosh",
      });
    }
  };

  const handleRegister = async () => {
    connect({
      connector: new ZeroDevConnector({
        chains,
        options: {
          projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          owner: await getOrCreateOwner(),
        },
      }),
    });
  };

  useEffect(() => {
    if (isConnected && session) {
      setOnboardingComplete(true);
    }
  }, [isConnected, session, setOnboardingComplete]);

  return (
    <div className="flex h-screen flex-col justify-between px-4 py-6">
      <div className="flex justify-between">
        <StepIndicator step={0} currentStep={step} name="" />
        <div onClick={() => setStep(1)}>
          <StepIndicator step={1} currentStep={step} name="" />
        </div>
      </div>
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
                {...register("name", {
                  onChange: () => {
                    void validateField("name");
                  },
                })}
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
            <span>Usually takes about 45 seconds</span>
            <h2 className="my-1 text-3xl">Create an account</h2>
            <p className="mb-8 text-lg">
              This is where your funds will be stored!
            </p>
            <div className="flex flex-col gap-4">
              <Button fullWidth onClick={() => void handleRegister()}>
                Get Started
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
