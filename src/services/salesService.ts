import { doc, increment, runTransaction } from "firebase/firestore";
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

  const today = getTodayString();
  const studentRef = doc(db, "Students", studentId);
  const reportRef = doc(db, "DailyReports", today);

  await runTransaction(db, async (transaction) => {
    // Read current daily report inside transaction for consistency
    const reportSnap = await transaction.get(reportRef);
    const existingSalesMap: Record<string, number> =
      reportSnap.exists() ? (reportSnap.data().salesMap ?? {}) : {};

    // Merge new items into existing salesMap
    const mergedSalesMap = { ...existingSalesMap };
    for (const [crepeTypeKey, qty] of Object.entries(items)) {
      if (qty > 0) {
        mergedSalesMap[crepeTypeKey] = (mergedSalesMap[crepeTypeKey] ?? 0) + qty;
      }
    }

    // Increment student's totalCount
    transaction.update(studentRef, { totalCount: increment(totalCrepes) });

    // Write the full merged document
    transaction.set(reportRef, { date: today, salesMap: mergedSalesMap });
  });
}
