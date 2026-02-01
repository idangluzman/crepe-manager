import { useState, useCallback } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useSettings } from "../../hooks/useSettings";
import { recordSale } from "../../services/salesService";
import { StudentAutocomplete } from "./StudentAutocomplete";
import { CrepeGrid } from "./CrepeGrid";
import { Toast } from "../ui/Toast";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { Student } from "../../types";

export function SalesForm() {
  const { students, loading: studentsLoading } = useStudents();
  const { settings, loading: settingsLoading } = useSettings();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCrepe, setSelectedCrepe] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleDismissToast = useCallback(() => setToast(null), []);

  if (studentsLoading || settingsLoading) return <LoadingSpinner />;

  async function handleConfirm() {
    if (!selectedStudent || !selectedCrepe || !settings) return;
    setSubmitting(true);
    try {
      await recordSale(selectedStudent.id, selectedCrepe);
      const crepeName = settings.crepeTypes[selectedCrepe]?.name ?? selectedCrepe;
      setToast({
        message: `Sold ${crepeName} to ${selectedStudent.name}!`,
        type: "success",
      });
      setSelectedStudent(null);
      setSelectedCrepe(null);
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
              setSelectedCrepe(null);
            }}
            className="text-sm text-chocolate-light/50 hover:text-chocolate transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {/* Step 2: Select crepe */}
      {selectedStudent && settings && (
        <CrepeGrid
          crepeTypes={settings.crepeTypes}
          selectedKey={selectedCrepe}
          onSelect={setSelectedCrepe}
        />
      )}

      {/* Step 3: Confirm */}
      {selectedStudent && selectedCrepe && (
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
            submitting
              ? "bg-accent-orange/50"
              : "bg-accent-orange hover:bg-accent-orange-light active:scale-[0.98] shadow-lg"
          }`}
        >
          {submitting ? "Recording..." : "Confirm Sale"}
        </button>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={handleDismissToast} />
      )}
    </div>
  );
}
