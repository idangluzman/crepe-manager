import type { ClassRanking } from "../../types";

interface ClassRankingListProps {
  rankings: ClassRanking[];
}

export function ClassRankingList({ rankings }: ClassRankingListProps) {
  if (rankings.length === 0) {
    return (
      <p className="text-center text-chocolate-light/60 py-8">
        No class data yet.
      </p>
    );
  }

  const maxCount = rankings[0].totalCount || 1;

  return (
    <div className="space-y-3">
      {rankings.map((ranking, i) => {
        const percentage = (ranking.totalCount / maxCount) * 100;
        return (
          <div key={ranking.className} className="bg-white rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium">
                {i === 0 && "🏆 "}Class {ranking.className}
              </span>
              <span className="text-sm text-chocolate-light/70">
                {ranking.totalCount} crepes · {ranking.studentCount} students
              </span>
            </div>
            <div className="w-full bg-cream-dark rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-accent-orange rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
