const depositVaultAddresses = {
  420: ["0xEDBaB88D819ad75556AD493Fb13366FF9fe3dB81"],
  31337: ["0x5FbDB2315678afecb367f032d93F642f64180aa3"],
} as const;

export type Addresses = typeof depositVaultAddresses;

export default depositVaultAddresses;
