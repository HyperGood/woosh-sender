// import { type Dispatch, useEffect, type SetStateAction, useState } from "react";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { useAnimate } from "framer-motion";
// import { type UseFormRegister } from "react-hook-form";
// import { type WalletTransaction } from "~/models/transactions";

// export const EnterAddress = ({
//   register,
//   saveContact,
//   setSaveContact,
//   validateField,
//   addressErrorMessage,
//   contactErrorMessage,
//   resetContact,
// }: {
//   saveContact: Checkbox.CheckedState;
//   setSaveContact: Dispatch<SetStateAction<Checkbox.CheckedState>>;
//   register: UseFormRegister<WalletTransaction>;
//   validateField: (args0: "address" | "contact") => Promise<void>;
//   addressErrorMessage?: string;
//   contactErrorMessage?: string;
//   resetContact: () => void;
// }) => {
//   const [touched, setTouched] = useState<boolean>(false);

//   const [ref, animate] = useAnimate();

//   useEffect(() => {
//     if (saveContact) {
//       void animate(ref.current, { backgroundColor: "var(--brand-accent)" });
//       void animate("div", { scale: 1 }, { type: "spring" });
//     } else {
//       void animate(ref.current, { backgroundColor: "var(--brand-gray-light)" });
//       void animate("div", { scale: 0 });
//       resetContact();
//       void validateField("address");
//     }
//   }, [saveContact]);

//   return (
//     <div className="flex flex-col gap-12">
//       <div className="flex flex-col gap-2">
//         <h2 className="text-2xl">Enter a Ethereum Address or ENS name</h2>
//       </div>
//       <div className="flex flex-col items-start">
//         <div className="flex w-full flex-col gap-2">
//           <label className="text-sm opacity-80">Ethereum Address or ENS</label>
//           <input
//             type="text"
//             {...register("address", {
//               onChange: () => {
//                 void validateField("address");
//               },
//             })}
//             className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
//             placeholder="Enter Ethereum address or ENS"
//             onBlur={() => setTouched(true)}
//           />
//           {addressErrorMessage && touched ? (
//             <span className="mt-2 text-sm text-error">
//               {addressErrorMessage}
//             </span>
//           ) : null}
//         </div>
//         <Checkbox.Root
//           checked={saveContact}
//           onCheckedChange={setSaveContact}
//           className="my-6 flex cursor-pointer items-center gap-2"
//         >
//           <div
//             ref={ref}
//             className="flex h-6 w-6  items-center justify-center rounded-[0.25rem] border border-brand-black/10 transition-colors"
//           >
//             <Checkbox.Indicator forceMount>
//               <div className="indicator h-2 w-2 rounded-sm bg-brand-black"></div>
//             </Checkbox.Indicator>
//           </div>
//           <span>Save as contact</span>
//         </Checkbox.Root>
//         {saveContact ? (
//           <div className="flex w-full flex-col gap-2">
//             <label className="text-sm opacity-80">Contact Name</label>
//             <input
//               type="text"
//               {...register("contact", {
//                 onChange: () => {
//                   if (saveContact) void validateField("contact");
//                 },
//               })}
//               className="rounded-lg border-[1px] border-brand-black bg-brand-white px-4 py-3 focus:border-2 focus:border-brand-black focus:outline-none "
//               placeholder="Enter a name or alias"
//             />
//             {contactErrorMessage ? (
//               <span className="mt-2 text-sm text-error">
//                 {contactErrorMessage}
//               </span>
//             ) : null}
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default EnterAddress;
