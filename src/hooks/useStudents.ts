import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Student } from "../types";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "Students"), orderBy("totalCount", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Student[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];
      setStudents(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { students, loading };
}
