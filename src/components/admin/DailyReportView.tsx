import { useDailyReport } from "../../hooks/useDailyReport";
import { useSettings } from "../../hooks/useSettings";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function DailyReportView() {
  const { report, loading: reportLoading } = useDailyReport();
  const { settings, loading: settingsLoading } = useSettings();

  if (reportLoading || settingsLoading) return <LoadingSpinner />;

  if (!report || Object.keys(report.salesMap).length === 0) {
    return (
      <p className="text-center text-chocolate-light/60 py-4 text-sm">
        No sales recorded today.
      </p>
    );
  }

  const totalSales = Object.values(report.salesMap).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-2">
      {Object.entries(report.salesMap).map(([key, count]) => {
        const name = settings?.crepeTypes[key]?.name ?? key;
        return (
          <div
            key={key}
            className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 shadow-sm"
          >
            <span className="text-sm font-medium">{name}</span>
            <span className="font-bold text-accent-orange">{count}</span>
          </div>
        );
      })}
      <div className="flex items-center justify-between px-4 py-2.5 font-bold border-t border-cream-dark mt-2 pt-3">
        <span>Total</span>
        <span className="text-accent-orange">{totalSales}</span>
      </div>
    </div>
  );
}
