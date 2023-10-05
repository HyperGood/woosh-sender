import useTokenPrices from "~/hooks/useTokenPrices";
import useUserBalance from "~/hooks/useUserBalance";

const TotalBalance = () => {
  const { tokenPrices } = useTokenPrices();
  const { userBalances } = useUserBalance();
  let totalBalance = 0;

  if (userBalances && tokenPrices) {
    for (const userBalance of userBalances) {
      if (tokenPrices[userBalance.tokenName]?.usd) {
        totalBalance +=
          userBalance.balance * tokenPrices[userBalance.tokenName]?.usd;
      }
    }
  } else {
    return (
      <span
        className="inline-block h-5 w-full animate-pulse rounded-sm bg-brand-gray-medium "
        style={{ animationDelay: "0.05s", animationDuration: "1s" }}
      />
    );
  }

  return (
    <div className="mb-6 flex w-full flex-col items-center gap-1">
      <span className="block">Your balance</span>
      <p className="text-center text-4xl">
        {totalBalance.toLocaleString("en-us", {
          style: "currency",
          currency: "USD",
        })}
      </p>{" "}
    </div>
  );
};

export default TotalBalance;
