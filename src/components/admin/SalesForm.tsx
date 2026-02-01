import { useState, useCallback } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useSettings } from "../../hooks/useSettings";
import { recordSale } from "../../services/salesService";
import { StudentAutocomplete } from "./StudentAutocomplete";
import { CrepeGrid } from "./CrepeGrid";
import type { CrepeSelection } from "./CrepeGrid";
import { Toast } from "../ui/Toast";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { Student } from "../../types";

export function SalesForm() {
  const { students, loading: studentsLoading } = useStudents();
  const { settings, loading: settingsLoading } = useSettings();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [crepeSelection, setCrepeSelection] = useState<CrepeSelection>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleDismissToast = useCallback(() => setToast(null), []);

  const totalCrepes = Object.values(crepeSelection).reduce((sum, qty) => sum + qty, 0);
  const hasSelection = totalCrepes > 0;

  if (studentsLoading || settingsLoading) return <LoadingSpinner />;

  async function handleConfirm() {
    if (!selectedStudent || !hasSelection || !settings) return;
    setSubmitting(true);
    try {
      await recordSale(selectedStudent.id, crepeSelection);

      const names = Object.entries(crepeSelection)
        .map(([key, qty]) => {
          const name = settings.crepeTypes[key]?.name ?? key;
          return `${qty}x ${name}`;
        })
        .join(", ");

      setToast({
        message: `Sold ${names} to ${selectedStudent.name}!`,
        type: "success",
      });
      setSelectedStudent(null);
      setCrepeSelection({});
    } catch {
      setToast({ message: "Failed to record sale. Try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Record Sale</h2>

      {/* Step 1: Select student */}
      {!selectedStudent ? (
        <StudentAutocomplete
          students={students}
          classes={settings?.classes ?? []}
          onSelect={setSelectedStudent}
        />
      ) : (
        <div className="bg-white rounded-lg px-4 py-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-medium">{selectedStudent.name}</p>
            <p className="text-xs text-chocolate-light/60">
              Class {selectedStudent.class} · {selectedStudent.totalCount} crepes
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedStudent(null);
              setCrepeSelection({});
            }}
            className="text-sm text-chocolate-light/50 hover:text-chocolate transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {/* Step 2: Select crepe types & quantities */}
      {selectedStudent && settings && (
        <CrepeGrid
          crepeTypes={settings.crepeTypes}
          selection={crepeSelection}
          onSelectionChange={setCrepeSelection}
        />
      )}

      {/* Step 3: Confirm */}
      {selectedStudent && hasSelection && (
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
            submitting
              ? "bg-accent-orange/50"
              : "bg-accent-orange hover:bg-accent-orange-light active:scale-[0.98] shadow-lg"
          }`}
        >
          {submitting
            ? "Recording..."
            : `Confirm Sale (${totalCrepes} crepe${totalCrepes !== 1 ? "s" : ""})`}
        </button>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={handleDismissToast} />
      )}
    </div>
  );
}
