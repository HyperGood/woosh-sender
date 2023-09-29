import Image from "next/image";
import useTokenPrices from "~/hooks/useTokenPrices";
const TokenBalance = ({
  token,
  balance,
  tokenName,
  isLoading,
  isError,
}: {
  token: string;
  balance: number;
  tokenName: "ethereum" | "usd-coin";
  isLoading?: boolean;
  isError?: string;
}) => {
  const { tokenPrices } = useTokenPrices();
  let balanceInUSD = 0;
  if (tokenPrices?.[tokenName]?.usd) {
    balanceInUSD = balance * tokenPrices?.[tokenName]?.usd;
  }

  if (isLoading)
    return (
      <span
        className="inline-block h-5 w-full animate-pulse rounded-sm bg-brand-gray-medium "
        style={{ animationDelay: "0.05s", animationDuration: "1s" }}
      />
    );

  if (isError) {
    console.log(`Error fetching ${token} balance: `, isError);
  }

  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Image
          src={`/images/tokens/${token}.svg`}
          width={24}
          height={24}
          alt={token}
          className="h-6 w-6 object-contain"
        />
        <div>
          <span>{balance} </span>
          <span>{token}</span>
        </div>
      </div>
      <span>
        {balanceInUSD.toLocaleString("en-us", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
};

export default TokenBalance;
