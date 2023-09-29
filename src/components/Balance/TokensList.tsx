import { Fragment } from "react";
import TokenBalance from "./TokenBalance";
import Divider from "../Divider";
import useUserBalance from "~/hooks/useUserBalance";

const TokensList = () => {
  const { userBalances } = useUserBalance();

  if (userBalances === null) {
    return <span>Error</span>;
  }

  return (
    <div className="mb-16 flex w-full flex-col gap-1">
      {userBalances.map((userBalance) => (
        <Fragment key={userBalance.token}>
          <TokenBalance
            token={userBalance.token}
            tokenName={userBalance.tokenName}
            balance={+userBalance.balance.toFixed(6)}
          />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

export default TokensList;
