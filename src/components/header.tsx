import Image from "next/image";
import Logo from "public/images/Logo";
import { useNetwork } from "wagmi";

export default function Header() {

  const {chain} = useNetwork()
  
  console.log(chain)

  return (
    <div className="flex items-center justify-between gap-4 absolute top-0 w-full px-10 py-8 z-50">
 <Logo/> 
      {chain &&      (<div className="bg-brand flex items-center bg-brand-gray-light px-8 py-2 rounded-md">
        <span className="mr-2">Network:</span>
        <Image src={`/images/networks/${chain.name.toLowerCase()}.svg`} alt={chain.name} width={24} height={24} className="mr-1 w-6 h-6 object-contain" />
        <span>{chain.name}</span>
      </div>)}

    </div>
  );
}
