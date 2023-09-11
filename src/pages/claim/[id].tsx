import { zodResolver } from "@hookform/resolvers/zod";
import { type Transaction } from "@prisma/client";
import { type InferGetStaticPropsType } from "next";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { Claim } from "~/components/Claim/Claim";
import { EnterPhone } from "~/components/Claim/EnterPhone";
import { Onboarding } from "~/components/Claim/Onboarding";
import { type Data } from "~/components/ComboboxSelect";
import { COUNTRIES, type Country } from "~/lib/countries";
import { formatPhone } from "~/lib/formatPhone";
import { UserSchema, type WooshUser } from "~/models/users";
import {
  getTransactionById,
  getAllPhoneTransactions,
} from "~/server/api/routers/transactions";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { type VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { getUserById } from "~/server/api/routers/users";
import { type VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

export default function ClaimPage({
  transaction,
  sender,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const formattedTransaction = JSON.parse(transaction) as Transaction;
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [formattedPhone, setFormattedPhone] = useState<string>("");
  //  const { signMessageAsync } = useSignMessage();
  //  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const { data: userData } = api.user.getUserData.useQuery(undefined, {
    enabled: !!session,
  });
  const senderData = JSON.parse(sender) as WooshUser;
  const [wrongCode, setWrongCode] = useState<boolean>(false);

  //Update the user
  const { mutate } = api.user.updateUser.useMutation({
    onSuccess: () => {
      console.log("Successfully updated user");
      void router.push("/");
    },
    onError: (error) => {
      toast.error(`There was an error saving the user ${error.message}`);
      console.error("Error updating user: ", error);
    },
  });

  const {
    register,
    formState: { errors },
    control,
    watch,
    getValues,
    setError,
  } = useForm<WooshUser>({
    resolver: zodResolver(UserSchema),
    mode: "all",
    defaultValues: {
      phone: "",
      name: "",
      address: "",
    },
  });

  const [selectedCountry, setSelectedCountry] = useState<Data>(
    COUNTRIES[0] as Data
  );

  const phone = watch("phone");

  //Find a transaction with that id (from the url)
  //if phone === transaction.phone -> verify
  useEffect(() => {
    const countryCode = selectedCountry as Country;
    setFormattedPhone(
      formatPhone(`${countryCode.additionalProperties.code}${phone || ""}`)
    );
  }, [phone, selectedCountry, formattedPhone]);

  //SIWE
  useEffect(() => {
    if (claimed && isConnected && !session) {
      console.log("Signing In...");
      void router.push("/");
      /**
       * Attempts SIWE and establish session
       */
      // async function siweSignIn() {
      //   try {
      //     const message = new SiweMessage({
      //       domain: window.location.host,
      //       address: address,
      //       statement: "Sign in to Woosh",
      //       uri: window.location.origin,
      //       version: "1",
      //       chainId: chain?.id,
      //       // nonce is used from CSRF token
      //       nonce: await getCsrfToken(),
      //     });
      //     const signature = await signMessageAsync({
      //       message: message.prepareMessage(),
      //     });
      //     void signIn("credentials", {
      //       message: JSON.stringify(message),
      //       redirect: false,
      //       signature,
      //     });
      //     console.log("Signed In");
      //   } catch (error) {
      //     console.error("Sign in error: ", error);
      //   }
      // }

      // void siweSignIn();
    } else if (claimed && !isConnected) {
      console.error("Not connected");
    }
  }, [claimed, address]);

  useEffect(() => {
    //Save user data to DB
    if (claimed && session && !userData?.name) {
      console.log("Saving user data to DB...");
      const inputData = getValues();
      mutate({
        name: inputData.name,
        phone: inputData.phone,
      });
      void router.push("/");
    } else if ((claimed && session && userData?.name !== null) || undefined) {
      void router.push("/");
    } else {
      console.log("Claimed Status: ", claimed);
      console.log("Session Status: ", session);
      console.log("User Name: ", userData?.name);
    }
  }, [session, userData?.name, claimed]);

  //If transaction is claimed, return claimed on [date and time] by [wallet]
  if (formattedTransaction.claimed) {
    return <div>Transaction claimed</div>;
  }

  if (claimed) {
    return (
      <div className="flex h-screen w-full animate-pulse items-center justify-center bg-brand-black text-brand-white">
        Signing In...
      </div>
    );
  }

  async function sendOTP() {
    if (formattedPhone && formattedPhone === formattedTransaction.phone) {
      const res = await fetch("/api/sms/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      await res.json().then((data: { verification: VerificationInstance }) => {
        if (data.verification.status === "pending") {
          setOtpSent(true);
        } else if (data.verification.status === "approved") {
          setOtpVerified(true);
        } else {
          setOtpSent(false);
          setOtpVerified(false);
          toast.error(
            `There was an error verifying your phone number. Try refreshing the page and try again.`
          );
        }
      });
    } else if (
      formattedPhone &&
      formattedPhone !== formattedTransaction.phone
    ) {
      //can we save an intent?
      setError("phone", { type: "custom", message: "Incorrect phone number" });
    } else {
      toast.error(
        `There was an error. Looks like no phone number was provided.`
      );
      //same here
    }
  }

  async function verifyOTP(otp: string) {
    if (otp && formattedPhone) {
      setWrongCode(false);
      const res = await fetch("/api/sms/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otpCode: otp, phone: formattedPhone }),
      });
      if (!res.ok) {
        throw new Error("Error in API call");
      } else {
        await res
          .json()
          .then((data: { verification_check?: VerificationCheckInstance }) => {
            if (
              data.verification_check &&
              data.verification_check.status === "approved"
            ) {
              setOtpVerified(true);
            } else {
              console.error("Wrong code");
              setWrongCode(true);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      console.error("No OTP set");
    }
  }
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {otpVerified && !onboardingComplete ? (
        <Onboarding
          register={register}
          setOnboardingComplete={setOnboardingComplete}
        />
      ) : onboardingComplete && otpVerified ? (
        <Claim
          transaction={formattedTransaction}
          setClaimed={setClaimed}
          sender={senderData.name ? senderData.name : "someone"}
        />
      ) : (
        <EnterPhone
          control={control}
          phoneErrorMessage={errors.phone?.message}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          otpSent={otpSent}
          sendOTP={sendOTP}
          verifyOTP={verifyOTP}
          wrongCode={wrongCode}
          sender={senderData.name ? senderData.name : "someone"}
        />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const transactions = await getAllPhoneTransactions({ prisma });

  const paths = transactions.map((transaction: Transaction) => ({
    params: { id: transaction.id },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const transaction = await getTransactionById({
    prisma,
    input: { id: params.id },
  });
  if (!transaction) {
    return {
      notFound: true,
    };
  }

  const sender = await getUserById({
    prisma,
    input: { id: transaction.userId },
  });

  return {
    props: {
      transaction: JSON.stringify(transaction),
      sender: JSON.stringify(sender),
    },
    revalidate: 1,
  };
}
