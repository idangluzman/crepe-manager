import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LoginButton } from "./LoginButton";
import { SalesForm } from "./SalesForm";
import { DailyReportView } from "./DailyReportView";

export function AdminPage() {
  const { user } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);

  if (!user) {
    return (
      <div className="max-w-sm mx-auto py-12">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LoginButton />
      <SalesForm />

      <div className="border-t border-cream-dark pt-4">
        <button
          onClick={() => setReportOpen(!reportOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-bold">Today's Sales</h2>
          <span
            className={`text-chocolate-light/50 transition-transform duration-200 ${
              reportOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
        {reportOpen && (
          <div className="mt-3">
            <DailyReportView />
          </div>
        )}
      </div>
    </div>
  );
}
