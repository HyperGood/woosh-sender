/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState, type ReactNode } from "react";

export interface TokenPrices {
  ethereum: {
    usd: number;
    mxn: number;
  };
  "usd-coin": {
    usd: number;
    mxn: number;
  };
}

interface TokenPricesContextProps {
  tokenPrices: TokenPrices | null;
  setTokenPrices: (data: TokenPrices) => void;
}

export const TokenPricesContext = createContext<TokenPricesContextProps>({
  tokenPrices: null,
  setTokenPrices: () => {},
});

interface TokenPricesProviderProps {
  children: ReactNode;
}

export const TokenPricesProvider = ({ children }: TokenPricesProviderProps) => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrices | null>(null);

  return (
    <TokenPricesContext.Provider value={{ tokenPrices, setTokenPrices }}>
      {children}
    </TokenPricesContext.Provider>
  );
};
