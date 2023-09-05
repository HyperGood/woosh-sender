export const contractAddress = {
  420: ["0xBb6FC4030D202627592C75A5C4C98Db083bcC4f7"],
  31337: ["0x5FbDB2315678afecb367f032d93F642f64180aa3"],
} as const;

//audit 2 contract
//0xBb6FC4030D202627592C75A5C4C98Db083bcC4f7

//contract using call
//0xC938Ef9CCc23a8aDBbBd4CcAFD6faea022e858FC

//pre audit contract
//0xED082e987588125BEA1cBAe6F9380f37eC15D1B3 = 420

//og contract
//0xEDBaB88D819ad75556AD493Fb13366FF9fe3dB81 = 420

export type Addresses = typeof contractAddress;

export const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "domainName",
        type: "string",
      },
      {
        internalType: "string",
        name: "domainVersion",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "DepositVault__DepositAmountMustBeGreaterThanZero",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__InvalidDepositIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__InvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__IsNotZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__IsZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__OnlyDepositor",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositVault__WithdrawalHasAlreadyBeenExecuted",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "depositIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawalMade",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deposits",
    outputs: [
      {
        internalType: "address payable",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depositIndex",
            type: "uint256",
          },
        ],
        internalType: "struct DepositVault.Withdrawal",
        name: "withdrawal",
        type: "tuple",
      },
    ],
    name: "getWithdrawalHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "usedWithdrawalHashes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositIndex",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositIndex",
        type: "uint256",
      },
    ],
    name: "withdrawDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
