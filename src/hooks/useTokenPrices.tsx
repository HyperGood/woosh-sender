import { useContext } from "react";
import { CryptoPricesContext } from "~/context/TokenPricesContext";

export const useTokenPrices = () => {
  return useContext(CryptoPricesContext);
};

export default useTokenPrices;
