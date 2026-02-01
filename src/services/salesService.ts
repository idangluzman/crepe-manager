import { doc, writeBatch, increment } from "firebase/firestore";
import { db } from "../lib/firebase";

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

/**
 * Records a sale by atomically updating the student's totalCount
 * and the daily report's salesMap for each crepe type.
 * @param items - Map of crepeTypeKey to quantity purchased
 */
export async function recordSale(
  studentId: string,
  items: Record<string, number>,
): Promise<void> {
  const totalCrepes = Object.values(items).reduce((sum, qty) => sum + qty, 0);
  if (totalCrepes <= 0) return;

  const batch = writeBatch(db);
  const today = getTodayString();

  // Increment student's totalCount by total crepes purchased
  const studentRef = doc(db, "Students", studentId);
  batch.update(studentRef, { totalCount: increment(totalCrepes) });

  // Ensure daily report document exists then increment each crepe type
  const reportRef = doc(db, "DailyReports", today);
  batch.set(reportRef, { date: today, salesMap: {} }, { merge: true });
  for (const [crepeTypeKey, qty] of Object.entries(items)) {
    if (qty > 0) {
      batch.update(reportRef, { [`salesMap.${crepeTypeKey}`]: increment(qty) });
    }
  }

  await batch.commit();
}
