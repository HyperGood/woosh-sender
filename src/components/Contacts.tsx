import Image from "next/image";

export const Contacts = () => {

    const Contact = ({name, photo}: {name: string; phone?: string; photo: number}) => {
      return (
        <div className="flex flex-col items-center gap-1 ">
          <Image src={`/images/avatars/${photo}.png`} width={48} height={48} alt={name} className="w-12 h-12 object-cover rounded-full"/>
          <span className="uppercase">{name}</span>
      
        </div>
      )
    }
  
    const contactsArr = [
      {
        Name: "Ali",
        Phone: "+1 (123) 456-7890",
        Photo: 1
      },
      {
        Name: "Henry",
        Phone: "+1 (123) 456-7890",
        Photo: 2
      },
      {
        Name: "Harry",
        Phone: "+1 (123) 456-7890",
        Photo: 3
      },
      {
        Name: "Fred",
        Phone: "+1 (123) 456-7890",
        Photo: 4
      },
      {
        Name: "Jacqueline",
        Phone: "+1 (123) 456-7890",
        Photo: 5
      },
      {
        Name: "Ali",
        Phone: "+1 (123) 456-7890",
        Photo: 1
      },
      {
        Name: "Henry",
        Phone: "+1 (123) 456-7890",
        Photo: 2
      },
      {
        Name: "Harry",
        Phone: "+1 (123) 456-7890",
        Photo: 3
      },
      {
        Name: "Fred",
        Phone: "+1 (123) 456-7890",
        Photo: 4
      },
      {
        Name: "Jacqueline",
        Phone: "+1 (123) 456-7890",
        Photo: 5
      },
    ]
  
  return (
    <div>
      <p className="text-lg font-polysans mb-8">contacts ({contactsArr.length})</p>
      <div className="flex overflow-scroll md:overflow-hidden md:grid md:grid-cols-5 justify-items-start gap-y-8 gap-x-8 md:gap-x-0 w-full">
  {contactsArr.map((contact, index) => (<div className="shrink-0" key={index}><Contact name={contact.Name} phone={contact.Phone} photo={contact.Photo}/></div>))}
      </div>
    </div>
  )
  }
  export default Contacts;