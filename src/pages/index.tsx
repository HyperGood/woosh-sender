import { ConnectKitButton } from "connectkit";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Layout from "~/components/layout";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected && !session) {
      router.push("/signin");
    }
  }, [isConnected]);
  return (
    <Layout>
      <div>Welcome {address}</div>
    </Layout>
  );
}
