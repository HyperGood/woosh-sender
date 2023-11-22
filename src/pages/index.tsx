import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Logo from "public/images/Logo";
import Button from "~/components/Button";
import { LoadingSpinner } from "~/components/Loading";
import { api } from "~/utils/api";
import ReferralUserProfile from "./ReferralUserProfile";
import SaveReferralUser from "./SaveReferralUser";

export default function ReferralsPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col px-2 py-8 lg:items-center lg:px-4">
      <div className="mx-auto flex max-w-lg flex-grow flex-col items-center justify-center">
        <ReferralsPageContent />
      </div>
    </main>
  );
}

interface LayoutProps {
  title: React.ReactNode;
  content: React.ReactNode;
}
function Layout({ title, content }: LayoutProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-grow flex-col items-center justify-center">
      <Logo className="mb-6 text-brand-black dark:text-brand-white" />
      <div className="mb-8 px-9">{title}</div>
      <div className="flex w-full items-center justify-center">{content}</div>
    </div>
  );
}

function DefaultLayout({ content }: Pick<LayoutProps, "content">) {
  return (
    <Layout
      title={
        <h1 className="text-center text-2xl">
          Pay anyone
          <br />
          with just a link
        </h1>
      }
      content={content}
    />
  );
}

// TODO:
// - add image to Schema
// - load referralId from query params, keep it for redirect and set it in SaveReferralUser
// - internationalization

function ConnectInstagram() {
  const router = useRouter();
  const referrerUsername = router.query.referrer as string | undefined;

  return (
    <DefaultLayout
      content={
        <div className="flex-grow">
          <Button
            size="full"
            intent="primary"
            onClick={() => {
              void signIn("instagram", {
                callbackUrl: `/${
                  referrerUsername ? `?referrer=${referrerUsername}` : ""
                }}`,
              });
            }}
          >
            Join Waitlist with Instagram
          </Button>
        </div>
      }
    />
  );
}

function Loading() {
  return <DefaultLayout content={<LoadingSpinner size={40} />} />;
}

function ReferralsPageContent() {
  const { data: session } = useSession();

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
    return <Loading />;
  }

  // 2. session exists

  // 2.1. userData exists (signed in with SIWE and Passkey)
  // - show Connect Instagram
  if (userData) {
    return <ConnectInstagram />;
  }

  // 2.2. referralUserData doesn't exist (signed in with Insta but ReferralUser hasn't yet been created)
  if (!referralUserData) {
    // - show phone input
    // - onSubmit: create new referralUserData for username and phone, re-render
    return <DefaultLayout content={<SaveReferralUser />} />;
  }

  // 2.3. referralUserData exists
  // - show referralUserData - leaderboard and invite link
  return (
    <Layout
      title={<h1 className="text-center text-2xl">You&apos;re in!</h1>}
      content={<ReferralUserProfile />}
    />
  );
}
