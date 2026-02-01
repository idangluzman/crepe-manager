import { useState, useRef, useEffect } from "react";
import type { Student } from "../../types";
import { addStudent } from "../../services/studentService";

interface StudentAutocompleteProps {
  students: Student[];
  classes: string[];
  onSelect: (student: Student) => void;
}

export function StudentAutocomplete({ students, classes, onSelect }: StudentAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newClass, setNewClass] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? students.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(student: Student) {
    setQuery("");
    setShowDropdown(false);
    onSelect(student);
  }

  async function handleAddNew() {
    if (!query.trim() || !newClass) return;
    setAdding(true);
    try {
      const id = await addStudent(query.trim(), newClass);
      const newStudent: Student = {
        id,
        name: query.trim(),
        class: newClass,
        totalCount: 0,
      };
      setQuery("");
      setShowNewForm(false);
      setNewClass("");
      onSelect(newStudent);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1.5 text-chocolate-light">
        Student Name
      </label>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
          setShowNewForm(false);
        }}
        onFocus={() => query.length > 0 && setShowDropdown(true)}
        placeholder="Search student name..."
        className="w-full px-4 py-3 rounded-lg border-2 border-cream-dark focus:border-accent-orange focus:outline-none bg-white text-chocolate placeholder:text-chocolate-light/40"
      />

      {showDropdown && query.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-cream-dark max-h-48 overflow-y-auto"
        >
          {filtered.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelect(student)}
              className="w-full text-left px-4 py-2.5 hover:bg-cream-dark transition-colors flex justify-between items-center"
            >
              <span className="font-medium">{student.name}</span>
              <span className="text-xs text-chocolate-light/60">
                Class {student.class}
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              setShowDropdown(false);
              setShowNewForm(true);
            }}
            className="w-full text-left px-4 py-2.5 text-accent-orange font-medium hover:bg-cream-dark transition-colors border-t border-cream-dark"
          >
            + Add "{query.trim()}" as new student
          </button>
        </div>
      )}

      {showNewForm && (
        <div className="mt-3 p-4 bg-white rounded-lg border-2 border-accent-orange/30 space-y-3">
          <p className="text-sm font-medium">
            Adding: <span className="text-accent-orange">{query.trim()}</span>
          </p>
          <div>
            <label className="block text-xs text-chocolate-light/70 mb-1">Class</label>
            <select
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-cream-dark focus:border-accent-orange focus:outline-none bg-white text-chocolate"
            >
              <option value="">Select class...</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddNew}
            disabled={!newClass || adding}
            className="w-full bg-accent-orange hover:bg-accent-orange-light disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {adding ? "Adding..." : "Add Student"}
          </button>
        </div>
      )}
    </div>
  );
}
