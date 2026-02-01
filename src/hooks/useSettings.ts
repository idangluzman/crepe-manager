import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Settings } from "../types";

const DEFAULT_CLASSES = ["5a", "5b", "6", "7", "8", "9", "10", "11", "12", "13"];

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Settings", "main"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          crepeTypes: data.crepeTypes ?? {},
          classes: data.classes ?? DEFAULT_CLASSES,
        });
      } else {
        setSettings({ crepeTypes: {}, classes: DEFAULT_CLASSES });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { settings, loading };
}
