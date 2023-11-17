import { LoadingSpinner } from "~/components/Loading";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import DeleteReferralUser from "./DeleteReferralUser";

export default function ReferralUserProfile() {
  const { data, isLoading, error } =
    api.referralUser.getReferralUserData.useQuery();

  console.log(data);

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

  const { phone, username, referrerId } = data;
  const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/referrals?referrer=${username}`;

  return (
    <div>
      <h2>{username}</h2>
      <h3>Invite link: {inviteLink}</h3>
      <DeleteReferralUser />
    </div>
  );
}
