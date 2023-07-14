export function makePhoneReadable(phone: string) {
  const readablePhone =
    phone.slice(0, phone.length - 10) +
    "-" +
    "(" +
    phone.slice(phone.length - 10, phone.length - 7) +
    ")-" +
    phone.slice(phone.length - 7, phone.length - 4) +
    "-" +
    phone.slice(phone.length - 4, phone.length);

  return readablePhone;
}

//Removes dashes, spaces, and parentheses from phone number
export function formatPhone(phone: string) {
  return phone.replace(/[-()\s]+/g, "");
}
