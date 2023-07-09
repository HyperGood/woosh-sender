import { useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "~/utils/api";

export const Contacts = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.contact.getContacts.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) return <div>No data</div>;

  const Contact = ({
    name,
    photo,
  }: {
    name: string;
    phone?: string;
    photo: number;
  }) => {
    return (
      <div className="flex flex-col items-center gap-1 ">
        <Image
          src={`/images/avatars/${photo}.png`}
          width={48}
          height={48}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <span className="uppercase">{name}</span>
      </div>
    );
  };

  return (
    <div>
      <p className="mb-8 font-polysans text-lg">contacts ({data.length})</p>
      <div className="flex w-full justify-items-start gap-x-8 gap-y-8 overflow-scroll md:grid md:grid-cols-5 md:gap-x-0 md:overflow-hidden">
        {data.map((contact, index) => (
          <div className="shrink-0" key={index}>
            <Contact name={contact.name} photo={1} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Contacts;
