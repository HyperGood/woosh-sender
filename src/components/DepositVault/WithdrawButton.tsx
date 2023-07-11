import { abi } from "../../lib/contract-abi";
import { parseEther } from "ethers";
import useDebounce from "~/hooks/useDebounce";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { despositValutAddressHH } from "~/lib/constants";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../Loading";
import { api } from "~/utils/api";
import { isHex } from "viem";
// import { useContext } from "react";
// import { CryptoPricesContext } from "~/context/TokenPricesContext";

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
  const debouncedAmount = useDebounce(amount, 500);
  const debouncedSecret = useDebounce(secret, 500);
  const { address: claimerAddress } = useAccount();
  const { mutate } = api.transaction.updateStatus.useMutation({
    onSuccess: () => {
      console.log("Transaction status updated");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //If tx success then update transaction to claimed
  function updateTransaction() {
    if (withdrawSuccess && claimerAddress) {
      mutate({
        id: transactionId,
        claimed: true,
        claimedAt: new Date(),
        claimedBy: claimerAddress,
      });
    } else {
      console.log("error updating transaction");
    }
  }

  const { config: contractWriteConfig } = usePrepareContractWrite({
    address: despositValutAddressHH,
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
      console.log(error);
      toast.error(`Deposit error: ${error.message}`);
    },
  });

  const { isLoading: isWithdrawing, isSuccess: withdrawSuccess } =
    useWaitForTransaction({
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
    address: despositValutAddressHH,
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

// 0x9aa17648c919a27676e171565c47fff16bf43d8f5cdf3d27161783b47e7ccace274af74f007d48ec4e99ed882b2e89554662386612ddce5374b71fce8dd155531b
