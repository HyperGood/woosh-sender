import { abi } from "../../lib/contract-abi";
import { parseEther } from "ethers";
import useDebounce from "~/hooks/useDebounce";
import {
    useContractEvent,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
  } from "wagmi";
  import { api } from "~/utils/api";
import { despositValutAddressHH } from "~/lib/constants";
import type { TransactionForm } from "./Send";


export const DepositButton = ({transaction}: {transaction: TransactionForm}) => {
    const debouncedAmount = useDebounce(transaction.amount, 500);
    const { mutate, isLoading: isSaving } = api.transaction.add.useMutation({
      onSuccess: () => {
        console.log("Saved!");
        void ctx.transaction.getTransactions.invalidate();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  
    const { config: contractWriteConfig } = usePrepareContractWrite({
      address: despositValutAddressHH,
      abi,
      functionName: "deposit",
      value: parseEther(debouncedAmount.toString()),
      enabled: Boolean(debouncedAmount),
    });
  
    const {
      data: depositData,
      write: deposit,
      isLoading: isDepositLoading,
      error: depositError,
    } = useContractWrite(contractWriteConfig);
  
    const {
      isLoading: isDepositing,
      isSuccess: txSuccess,
      error: txError,
    } = useWaitForTransaction({
      hash: depositData?.hash,
      onSuccess(txData) {
        console.log("txData: ", txData);
        saveTransaction({ txId: txData.transactionHash });
      },
    });
  
    useContractEvent({
      address: despositValutAddressHH,
      abi,
      eventName: "DepositMade",
      listener(log) {
        console.log("Event: ", log);
      },
    });
  
    const ctx = api.useContext();
  
    const sendFunction = () => {
      if (transaction.phone === "") {
        alert("Please enter a phone number");
      } else if (transaction.amount === 0) {
        alert("Please enter an amount greater than 0");
      } else {
        deposit?.();
      }
    };
  
    const saveTransaction = ({ txId }: { txId: string }) => {
      if (transaction.amount !== 0 && transaction.phone !== "" && txId) {
        const amountInUSD = transaction.amount * 2000;
        mutate({
          ...transaction,
          amountInUSD: amountInUSD,
          txId: txId,
        });
      } else {
        console.log("Error saving transaction");
      }
    };
  
    return (
      <>
        {isDepositLoading && <span>Waiting for approval</span>}
        {isDepositing && <span>Sending funds...</span>}
        {depositError && (
            <span className="text-red font-bold">{depositError.message}</span>
          )}
        {txError && <span className="text-red font-bold">{txError.message}</span>}
        {txSuccess && <span className="text-green font-bold">Sent!</span>}

        

        <button
            onClick={() => void sendFunction()}
            disabled={isSaving || isDepositLoading || isDepositing}
            className="rounded-full bg-gray-100 px-12 py-4 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button> 
           
      </>
    );
  };

  export default DepositButton;