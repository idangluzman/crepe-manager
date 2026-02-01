import { useMemo } from "react";
import type { Student, ClassRanking } from "../types";

export function useLeaderboard(students: Student[]) {
  const classRankings = useMemo(() => {
    const map = new Map<string, { totalCount: number; studentCount: number }>();
    for (const s of students) {
      const existing = map.get(s.class) ?? { totalCount: 0, studentCount: 0 };
      existing.totalCount += s.totalCount;
      existing.studentCount += 1;
      map.set(s.class, existing);
    }
    const rankings: ClassRanking[] = Array.from(map.entries()).map(
      ([className, data]) => ({ className, ...data })
    );
    rankings.sort((a, b) => b.totalCount - a.totalCount);
    return rankings;
  }, [students]);

  const topThree = students.slice(0, 3);
  const rest = students.slice(3);

  return { topThree, rest, classRankings };
}
