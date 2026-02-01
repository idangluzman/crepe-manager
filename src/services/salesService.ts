import { doc, writeBatch, increment, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export async function recordSale(studentId: string, crepeTypeKey: string): Promise<void> {
  const batch = writeBatch(db);
  const today = getTodayString();

  // Increment student's totalCount
  const studentRef = doc(db, "Students", studentId);
  batch.update(studentRef, { totalCount: increment(1) });

  // Increment daily report's salesMap for this crepe type
  const reportRef = doc(db, "DailyReports", today);
  const reportSnap = await getDoc(reportRef);

  if (reportSnap.exists()) {
    batch.update(reportRef, { [`salesMap.${crepeTypeKey}`]: increment(1) });
  } else {
    // Create the daily report first, then update via batch
    await setDoc(reportRef, { date: today, salesMap: {} });
    batch.update(reportRef, { [`salesMap.${crepeTypeKey}`]: increment(1) });
  }

  await batch.commit();
}
