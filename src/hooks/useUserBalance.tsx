import { useContext } from "react";
import { UserBalancesContext } from "~/context/UserBalanceContext";

export const useUserBalance = () => {
  return useContext(UserBalancesContext);
};

export default useUserBalance;
