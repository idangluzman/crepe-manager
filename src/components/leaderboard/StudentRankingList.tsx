import type { Student } from "../../types";

interface StudentRankingListProps {
  students: Student[];
  startRank: number;
}

export function StudentRankingList({ students, startRank }: StudentRankingListProps) {
  if (students.length === 0) return null;

  return (
    <div className="space-y-2">
      {students.map((student, i) => (
        <div
          key={student.id}
          className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm"
        >
          <span className="text-chocolate-light/50 font-mono text-sm w-8">
            #{startRank + i}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{student.name}</p>
            <p className="text-xs text-chocolate-light/60">Class {student.class}</p>
          </div>
          <span className="font-bold text-accent-orange ml-2">
            {student.totalCount}
          </span>
        </div>
      ))}
    </div>
  );
}
