import { abi } from "../../lib/DepositVaultABI";

import useDebounce from "~/hooks/useDebounce";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { contractAddress, type Addresses } from "../../lib/DepositVaultABI";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import { api } from "~/utils/api";
import { isHex, parseEther } from "viem";

export const WithdrawButton = ({
  transactionId,
  amount,
  secret,
  nonce,
}: {
  transactionId: string;
  amount: number;
  secret: string;
  nonce: bigint;
}) => {
  //   const { cryptoPrices } = useContext(CryptoPricesContext);
  //   const ethPrice = cryptoPrices?.ethereum.usd || 0;
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const depositVaultAddress =
    chainId && chainId in contractAddress
      ? contractAddress[chainId as keyof Addresses][0]
      : "0x12";
  const debouncedAmount = useDebounce(amount, 500);
  const debouncedSecret = useDebounce(secret, 500);
  const { address: claimerAddress } = useAccount();
  const { mutate } = api.transaction.updateClaimedStatus.useMutation({
    onSuccess: () => {
      console.log("Transaction status updated");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: depositVaultAddress,
    abi,
    functionName: "withdraw",
    args: [
      parseEther(debouncedAmount.toString()),
      nonce,
      isHex(secret) ? secret : "0x",
      claimerAddress || "0x",
    ],
    enabled:
      Boolean(debouncedAmount) &&
      Boolean(claimerAddress) &&
      Boolean(debouncedSecret),
    onError(error) {
      console.log(error);
      toast.error(error.message);
    },
  });

  const {
    data: withdrawData,
    write: withdraw,
    isLoading: isWithdrawLoading,
  } = useContractWrite({
    ...contractWriteConfig,
    onError(error) {
      if (error.message.includes("User rejected the request")) {
        toast.error("Don't worry no funds were sent.");
        toast.error(
          "It looks like you rejected the transaction in your wallet. Try again and accept the transaction."
        );
      } else {
        console.log("There was an error depositing the funds ", error);
        toast.error(`Deposit error: ${error.message}`);
      }
    },
  });

  const { isLoading: isWithdrawing } = useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess(txData) {
      updateTransaction();
      console.log("txData: ", txData);
      toast.success(`Funds withdrew!`);
    },
    onError(error) {
      console.log(error);
      toast.error(`Transaction error: ${error.message}`);
    },
  });

  useContractEvent({
    address: depositVaultAddress,
    abi,
    eventName: "WithdrawalMade",
    listener(log) {
      console.log(log);
    },
  });

  const withdrawFunction = () => {
    if (amount === 0) {
      alert("Please enter an amount greater than 0");
    } else {
      withdraw?.();
    }
  };

  //If tx success then update transaction to claimed
  function updateTransaction() {
    if (claimerAddress) {
      mutate({
        id: transactionId,
        claimed: true,
        claimedAt: new Date(),
        claimedBy: claimerAddress,
      });
    } else {
      console.log("error updating transaction");
      console.log("Claimer address: ", claimerAddress);
    }
  }

  return (
    <>
      {isWithdrawing && (
        <div className="flex items-center gap-4">
          <span>Sending funds</span> <LoadingSpinner />{" "}
        </div>
      )}

      <button
        onClick={() => void withdrawFunction()}
        disabled={isWithdrawLoading || isWithdrawing}
        className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isWithdrawLoading ? "Waiting for approval" : "Withdraw"}
      </button>
    </>
  );
};

export default WithdrawButton;
