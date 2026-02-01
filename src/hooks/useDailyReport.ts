import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { DailyReport } from "../types";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function useDailyReport() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = getTodayString();
    const unsubscribe = onSnapshot(doc(db, "DailyReports", today), (snap) => {
      if (snap.exists()) {
        setReport({ id: snap.id, ...snap.data() } as DailyReport);
      } else {
        setReport(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { report, loading };
}
