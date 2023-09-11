import type { Data } from "~/components/ComboboxSelect";
import { env } from "~/env.mjs";
import { outAddress } from "./erc-20/opg-out";
import { usdcAddress } from "./erc-20/op-usdc";
export interface Token extends Data {
  additionalProperties: {
    address: `0x${string}`;
    tokenName: string;
  };
}

export const TOKENS = [
  {
    id: 1,
    displayValue: "ETH",
    additionalProperties: {
      address: "0x0000000000000000000000000000000000000000",
      tokenName: "ethereum",
    },
  },
  {
    id: 2,
    displayValue: "USDc/OUT",
    additionalProperties: {
      address: env.NEXT_PUBLIC_TESTNET === "true" ? outAddress : usdcAddress,
      tokenName: "usd-coin",
    },
  },
  // {
  //   id: 3,
  //   displayValue: "DAI",
  //   additionalProperties: {
  //     address: "0x123",
  //     tokenName: "dai",
  //   },
  // },
  // {
  //   id: 4,
  //   displayValue: "lUSD",
  //   additionalProperties: {
  //     address: "0x123",
  //     tokenName: "dai",
  //   },
  // },
  // {
  //   id: 5,
  //   displayValue: "USDt",
  //   additionalProperties: {
  //     address: "0x123",
  //     tokenName: "dai",
  //   },
  // },
  // {
  //   id: 6,
  //   displayValue: "RAI",
  //   additionalProperties: {
  //     address: "0x123",
  //     tokenName: "dai",
  //   },
  // },
];
