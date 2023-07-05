import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDisconnect } from "wagmi";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session } = useSession();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  return (
    <header>
      <div className="flex w-full items-center justify-between">
        <p>
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                />
              )}
              <span>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
            </>
          )}
        </p>
        {session?.user && (
          <a
            href={`/api/auth/signout`}
            onClick={(e) => {
              e.preventDefault();
              disconnect();
              void signOut();
              router.push("/login");
            }}
          >
            Sign out
          </a>
        )}
      </div>
    </header>
  );
}
