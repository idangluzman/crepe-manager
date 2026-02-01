import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { PodiumDisplay } from "./PodiumDisplay";
import { StudentRankingList } from "./StudentRankingList";
import { ClassRankingList } from "./ClassRankingList";
import { LoadingSpinner } from "../ui/LoadingSpinner";

type Tab = "individual" | "class";

export function LeaderboardPage() {
  const { students, loading } = useStudents();
  const { topThree, rest, classRankings } = useLeaderboard(students);
  const [tab, setTab] = useState<Tab>("individual");

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">Leaderboard</h1>

      <div className="flex rounded-lg bg-cream-dark p-1 mb-6">
        <button
          onClick={() => setTab("individual")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "individual"
              ? "bg-white text-chocolate shadow-sm"
              : "text-chocolate-light/60 hover:text-chocolate"
          }`}
        >
          Individual
        </button>
        <button
          onClick={() => setTab("class")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "class"
              ? "bg-white text-chocolate shadow-sm"
              : "text-chocolate-light/60 hover:text-chocolate"
          }`}
        >
          By Class
        </button>
      </div>

      {tab === "individual" ? (
        <>
          <PodiumDisplay students={topThree} />
          <StudentRankingList students={rest} startRank={4} />
        </>
      ) : (
        <ClassRankingList rankings={classRankings} />
      )}
    </div>
  );
}
