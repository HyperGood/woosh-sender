import type { Data } from "~/components/ComboboxSelect";
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
      address: "0x32307adfFE088e383AFAa721b06436aDaBA47DBE",
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
