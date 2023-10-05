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
import { Onboarding } from "~/components/Claim/Onboarding";
import { UserSchema, type WooshUser } from "~/models/users";
import {
  getTransactionById,
  getAllTransactions,
} from "~/server/api/routers/transactions";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { getUserById } from "~/server/api/routers/users";

export default function ClaimPage({
  transaction,
  sender,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const formattedTransaction = JSON.parse(transaction) as Transaction;
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  // const { data: session } = useSession();
  // const { data: userData } = api.user.getUserData.useQuery(undefined, {
  //   enabled: !!session,
  // });

  const senderData = JSON.parse(sender) as WooshUser;

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

  const { register, getValues } = useForm<WooshUser>({
    resolver: zodResolver(UserSchema),
    mode: "all",
    defaultValues: {
      name: "",
      address: "",
    },
  });

  //SIWE
  useEffect(() => {
    if (claimed && isConnected) {
      console.log("Signing In...");
      /**
       * Attempts SIWE and establish session
       */
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
          await signIn("credentials", {
            message: JSON.stringify(message),
            redirect: false,
            signature,
          });
          console.log("Signed In");
          console.log("Saving user data to DB...");
          const inputData = getValues();
          mutate({
            name: inputData.name,
          });
        } catch (error) {
          console.error("Sign in error: ", error);
        }
      }

      void siweSignIn();
    } else if (claimed && !isConnected) {
      console.error("Not connected");
    }
  }, [claimed, address]);

  //If transaction is claimed, return claimed on [date and time] by [wallet]
  if (formattedTransaction.claimed) {
    return <div>Transaction claimed</div>;
  }

  if (claimed) {
    return (
      <div className="flex h-screen w-full animate-pulse items-center justify-center bg-brand-accent text-brand-black">
        Success!
      </div>
    );
  }

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {!onboardingComplete ? (
        <Onboarding
          register={register}
          setOnboardingComplete={setOnboardingComplete}
          sender={senderData.name ? senderData.name : "someone"}
        />
      ) : (
        <Claim
          transaction={formattedTransaction}
          setClaimed={setClaimed}
          sender={senderData.name ? senderData.name : "someone"}
        />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const transactions = await getAllTransactions({ prisma });

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
