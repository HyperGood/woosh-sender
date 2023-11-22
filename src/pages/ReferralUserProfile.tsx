import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import { LoadingSpinner } from "~/components/Loading";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import Leaderboard from "./Leaderboard";

const phoneUtil = PhoneNumberUtil.getInstance();

function Referrer() {
  const { data: referrer } = api.referralUser.getReferrer.useQuery();

  if (!referrer) {
    return null;
  }

  return <h4 className="mt-2 text-lg">Referred by: {referrer}</h4>;
}

export default function ReferralUserProfile() {
  const { data, isLoading, error } =
    api.referralUser.getReferralUserData.useQuery();

  if (error) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <p>Something went wrong!</p>
        <p>Error: {error?.message ?? "Unknown"}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return <LoadingSpinner size={40} />;
  }
  const { phone, username } = data;
  const inviteLink = username
    ? `https://${env.NEXT_PUBLIC_APP_URL}?referrer=${username}`
    : undefined;

  const phoneNumber = phone
    ? phoneUtil.format(phoneUtil.parse(phone), PhoneNumberFormat.INTERNATIONAL)
    : undefined;

  return (
    <div className="flex flex-col items-center justify-center rounded p-4">
      <h3 className="text-xl">💸 {username} 💸</h3>
      {phoneNumber ? (
        <h4 className="mt-2 text-lg">Phone: {phoneNumber}</h4>
      ) : null}
      <Referrer />
      {inviteLink ? (
        <Button
          className="mt-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(inviteLink);
              toast.success("Invite link copied!");
            } catch (err) {
              toast.error("Something went wrong!");
            }
          }}
        >
          Copy invite link
        </Button>
      ) : null}
      <Leaderboard />
    </div>
  );
}
