import { signIn, useSession } from "next-auth/react";
import Logo from "public/images/Logo";
import Button from "~/components/Button";
import { LoadingSpinner } from "~/components/Loading";
import { api } from "~/utils/api";
import DeleteReferralUser from "./DeleteReferralUser";
import SaveReferralUser from "./SaveReferralUser";

export default function ReferralsPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col px-2 py-8 lg:items-center lg:px-4">
      <Logo />
      <div className="mx-auto flex max-w-lg flex-grow flex-col items-center justify-center">
        <h1 className="mb-5 w-full text-center text-2xl">Request Access</h1>
        <div className="mb-8 text-center">
          Join the waitlist to access Woosh or ask a friend that uses Woosh to
          send you funds via a claim link to get access to the app.
        </div>
        <div className="flex w-full items-center justify-center">
          <ReferralsPageContent />
        </div>
      </div>
    </main>
  );
}

// TODO:
// - add image to Schema
// - load referralId from query params, keep it for redirect and set it in SaveReferralUser
// - internationalization

function ConnectInstagram() {
  return (
    <div className="max-w-lg flex-grow">
      <Button
        size="full"
        intent="primary"
        onClick={() => {
          void signIn("instagram", {
            callbackUrl: `/referrals`,
          });
        }}
      >
        Connect Instagram
      </Button>
    </div>
  );
}

function ReferralsPageContent() {
  const { data: session } = useSession();

  // TODO: Remove
  console.log(session);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: userDataError,
  } = api.user.getUserData.useQuery(undefined, {
    enabled: !!session,
  });
  const {
    data: referralUserData,
    isLoading: isReferralUserDataLoading,
    error: referralUserDataError,
  } = api.referralUser.getReferralUserData.useQuery(undefined, {
    enabled: !!session,
  });

  // TODO: remove
  // console.log(
  //   {
  //     userData,
  //     isUserDataLoading,
  //     userDataError,
  //     userDataStatus,
  //     userDataFetchStatus,
  //   },
  //   {
  //     referralUserData,
  //     isReferralUserDataLoading,
  //     referralUserDataError,
  //     referralUserDataStatus,
  //     referralUserDataFetchStatus,
  //   }
  // );

  // 1. session doesn't exist
  // - show Connect Instagram
  if (!session) {
    return <ConnectInstagram />;
  }

  if (userDataError || referralUserDataError) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <p>Something went wrong!</p>
        <p>Error: {userDataError?.message ?? referralUserDataError?.message}</p>
      </div>
    );
  }

  if (isUserDataLoading || isReferralUserDataLoading) {
    return <LoadingSpinner size={40} />;
  }

  // 2. session exists

  // 2.1. userData exists
  // - show Connect Instagram
  if (userData) {
    return <ConnectInstagram />;
  }

  // 2.2. referralUserData doesn't exist
  // COMMENT: we can connect existing User accounts through the phone number being the same
  if (!referralUserData) {
    // - show phone input
    // - onSubmit: create new referralUserData for username and phone, re-render
    return <SaveReferralUser />;
  }

  // 2.3. referralUserData exists
  // - show referralUserData - leaderboard and invite link

  // TODO: Add showing Referral User data (profile and invite link and Success message) and Leaderboard
  return (
    <div>
      Referral User Data <DeleteReferralUser />
    </div>
  );
}
