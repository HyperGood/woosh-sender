import { useSession } from "next-auth/react";
import { LoadingSpinner } from "~/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/Table";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

export default function Leaderboard() {
  const { data: session } = useSession();
  const { data, isLoading } = api.referralUser.getLeaderboard.useQuery();

  if (isLoading) {
    return <LoadingSpinner size={40} />;
  }

  if (!data) return null;

  const username = session?.user.name;

  const decoratedLeaderboard = data.map((row) => {
    return {
      ...row,
      isCurrentUser: row.username === username,
    };
  });

  return (
    <div className="mt-10">
      <h2 className="text-center text-xl">Top 10</h2>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">Referrals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {decoratedLeaderboard.map(
            ({ referredCount, username, isCurrentUser }, ind) => (
              <TableRow
                key={ind}
                className={cn(isCurrentUser ? "text-error" : undefined)}
              >
                <TableCell>{ind + 1}</TableCell>
                <TableCell>{username}</TableCell>
                <TableCell className="text-right">{referredCount}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
