import { useAccount } from "wagmi";
import Layout from "~/components/layout";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <Layout>
      {isConnected ? (
        <div>Welcome!</div>
      ) : (
        <div>Connect your wallet to get started</div>
      )}
    </Layout>
  );
}
