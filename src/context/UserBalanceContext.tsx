/* eslint-disable @typescript-eslint/no-empty-function */

import { createContext, useState, type ReactNode } from "react";

interface UserBalance {
  token: string;
  tokenName: "ethereum" | "usd-coin";
  balance: number;
}

type UserBalances = UserBalance[];

interface UserBalancesContextProps {
  userBalances: UserBalances | null;
  setUserBalances: (data: UserBalances) => void;
}

export const UserBalancesContext = createContext<UserBalancesContextProps>({
  userBalances: null,
  setUserBalances: () => {},
});

interface UserBalancesProviderProps {
  children: ReactNode;
}

export const UserBalancesProvider = ({
  children,
}: UserBalancesProviderProps) => {
  const [userBalances, setUserBalances] = useState<UserBalances | null>(null);

  return (
    <UserBalancesContext.Provider value={{ userBalances, setUserBalances }}>
      {children}
    </UserBalancesContext.Provider>
  );
};
