import { useContext } from "react";
import { TokenPricesContext } from "~/context/TokenPricesContext";

export const useTokenPrices = () => {
  return useContext(TokenPricesContext);
};

export default useTokenPrices;
