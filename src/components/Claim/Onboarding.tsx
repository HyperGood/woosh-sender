import { useAccount, useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { createPasskeyOwner } from "@zerodev/sdk/passkey";
import { env } from "~/env.mjs";
import { chains } from "~/pages/_app";
import StepIndicator from "~/components/Form/StepIndicator";
import Button from "~/components/Button";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { type UseFormRegister } from "react-hook-form";
import { type WooshUser } from "~/models/users";
import PasskeySignIn from "../PasskeySignIn";
import { useSession } from "next-auth/react";

export const Onboarding = ({
  register,
  validateField,
  setOnboardingComplete,
}: {
  validateField: (args0: "username" | "phone") => Promise<void>;
  register: UseFormRegister<WooshUser>;
  setOnboardingComplete: Dispatch<SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState<number>(0);
  const { connect } = useConnect();
  const { isConnected } = useAccount({ onConnect: () => setStep(1) });
  const { data: session } = useSession();

  const handleRegister = async () => {
    console.log("Creating account");
    connect({
      connector: new ZeroDevConnector({
        chains,
        options: {
          projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          owner: await createPasskeyOwner({
            name: "Woosh",
            projectId: env.NEXT_PUBLIC_ZERODEV_ID,
          }),
        },
      }),
    });
  };

  useEffect(() => {
    if (isConnected && session) {
      setOnboardingComplete(true);
    }
  }, [isConnected, session]);

  return (
    <div className="flex h-screen flex-col justify-between px-4 py-6">
      <div className="flex justify-between">
        <StepIndicator step={0} currentStep={step} name="" />
        <StepIndicator step={1} currentStep={step} name="" />
        <StepIndicator step={2} currentStep={step} name="" />
      </div>
      {isConnected && step === 1 ? (
        <>
          <div>
            <h2 className="my-1 text-3xl">Pick a username</h2>
            <p className="mb-8 text-lg">
              This is how people will easily find you!
            </p>
            <div className="relative mb-12 flex flex-col justify-center gap-4">
              <input
                type="text"
                className="w-full rounded-full border border-brand-black/20 bg-transparent p-4 pl-12"
                placeholder="username"
                {...register("username", {
                  onChange: () => {
                    void validateField("username");
                  },
                })}
              />
              <span className="absolute ml-6">@</span>
            </div>
            <div className="flex flex-col gap-4">
              <Button intent="secondary" fullWidth onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          </div>
          <div />
        </>
      ) : isConnected && step === 2 ? (
        <>
          <div>
            <h2 className="my-1 text-3xl">Add a profile picture</h2>
            <p className="mb-8 text-lg">So people can easily identify you</p>
            <div className="relative mb-12 gap-4">
              <div className="mx-auto aspect-square w-[80%] rounded-full bg-brand-gray-light" />
            </div>
            <div className="flex flex-col gap-4">
              <Button
                intent="secondary"
                fullWidth
                onClick={() => setOnboardingComplete(true)}
              >
                Next
              </Button>
              <button className="underline opacity-60">Skip</button>
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
              <Button
                intent="secondary"
                fullWidth
                onClick={() => void handleRegister()}
              >
                Get Started
              </Button>
              <PasskeySignIn />
            </div>
          </div>
          <button className="font-bold underline">What is Woosh?</button>
        </>
      )}
    </div>
  );
};
