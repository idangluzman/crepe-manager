import type { Student } from "../../types";

const MEDALS = [
  { label: "🥇", bg: "bg-gold/20", border: "border-gold", text: "text-yellow-700" },
  { label: "🥈", bg: "bg-silver/20", border: "border-silver", text: "text-gray-600" },
  { label: "🥉", bg: "bg-bronze/20", border: "border-bronze", text: "text-amber-700" },
];

interface PodiumDisplayProps {
  students: Student[];
}

export function PodiumDisplay({ students }: PodiumDisplayProps) {
  if (students.length === 0) {
    return (
      <p className="text-center text-chocolate-light/60 py-8">
        No students yet. Sales will appear here!
      </p>
    );
  }

  // Display order: 2nd, 1st, 3rd for podium effect
  const podiumOrder = [1, 0, 2];

  return (
    <div className="flex items-end justify-center gap-3 py-6">
      {podiumOrder.map((index) => {
        const student = students[index];
        if (!student) return <div key={index} className="w-24" />;
        const medal = MEDALS[index];
        const isFirst = index === 0;

        return (
          <div
            key={student.id}
            className={`flex flex-col items-center ${isFirst ? "order-2" : index === 1 ? "order-1" : "order-3"}`}
          >
            <span className="text-3xl mb-1">{medal.label}</span>
            <div
              className={`${medal.bg} ${medal.border} border-2 rounded-xl p-3 text-center transition-all duration-500 ${
                isFirst ? "w-28 pb-6" : "w-24 pb-4"
              }`}
            >
              <p className={`font-bold ${medal.text} ${isFirst ? "text-lg" : "text-base"} truncate`}>
                {student.name}
              </p>
              <p className="text-xs text-chocolate-light/70">Class {student.class}</p>
              <p className={`font-bold mt-1 ${medal.text} ${isFirst ? "text-2xl" : "text-xl"}`}>
                {student.totalCount}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
