import Image from "next/image";
import Logo from "public/images/Logo";
import { useNetwork } from "wagmi";

export default function Header() {
  const { chain } = useNetwork();

  return (
    <div className="absolute top-0 z-50 flex w-full items-center justify-between gap-4 px-4 py-4 lg:px-10 lg:py-8">
      <Logo />
      {chain && (
        <div className="bg-brand flex items-center rounded-md bg-brand-gray-light px-8 py-2">
          <span className="mr-2">Network:</span>
          <Image
            src={`/images/networks/${chain.name.toLowerCase()}.svg`}
            alt={chain.name}
            width={24}
            height={24}
            className="mr-1 h-6 w-6 object-contain"
          />
          <span>{chain.name}</span>
        </div>
      )}
    </div>
  );
}
