/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState, type ReactNode } from 'react';

export interface CryptoPrices {
  ethereum: {
    usd: number;
    mxn: number;
  };
  dai: {
    usd: number;
    mxn: number;
  };
  'usd-coin': {
    usd: number;
    mxn: number;
  };
}

interface CryptoPricesContextProps {
  cryptoPrices: CryptoPrices | null;
  setCryptoPrices: (data: CryptoPrices) => void;
}

export const CryptoPricesContext = createContext<CryptoPricesContextProps>({
  cryptoPrices: null,
  setCryptoPrices: () => {},
});

interface CryptoPricesProviderProps {
  children: ReactNode;
}

export const CryptoPricesProvider = ({ children }: CryptoPricesProviderProps) => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices | null>(null);

  return (
    <CryptoPricesContext.Provider value={{ cryptoPrices, setCryptoPrices }}>
      {children}
    </CryptoPricesContext.Provider>
  );
};
