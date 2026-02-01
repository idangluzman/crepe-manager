import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import type { Settings, CrepeType } from "../types";

const DEFAULT_CLASSES = ["5a", "5b", "6", "7", "8", "9", "10", "11", "12", "13"];

/** Convert a gs:// URI to an HTTPS download URL via Firebase Storage. */
async function resolveImageUrl(gsUrl: string): Promise<string> {
  if (!gsUrl.startsWith("gs://")) return gsUrl;
  const storageRef = ref(storage, gsUrl);
  return getDownloadURL(storageRef);
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to both Settings documents in parallel
    let classesData: string[] = DEFAULT_CLASSES;
    let typesRaw: Array<{ name: string; imageUrl: string }> = [];
    let gotClasses = false;
    let gotTypes = false;

    function tryBuild() {
      if (!gotClasses || !gotTypes) return;

      // Convert the types array into a keyed record and resolve gs:// URLs
      const crepeTypes: Record<string, CrepeType> = {};
      const urlPromises: Promise<void>[] = [];

      typesRaw.forEach((t, i) => {
        const key = String(i);
        crepeTypes[key] = { name: t.name, imageUrl: t.imageUrl };

        if (t.imageUrl.startsWith("gs://")) {
          urlPromises.push(
            resolveImageUrl(t.imageUrl).then((url) => {
              crepeTypes[key] = { name: t.name, imageUrl: url };
            }).catch(() => {
              // Keep the gs:// URL as fallback — image will show emoji placeholder
              crepeTypes[key] = { name: t.name, imageUrl: "" };
            }),
          );
        }
      });

      if (urlPromises.length > 0) {
        Promise.all(urlPromises).then(() => {
          setSettings({ crepeTypes, classes: classesData });
          setLoading(false);
        });
      } else {
        setSettings({ crepeTypes, classes: classesData });
        setLoading(false);
      }
    }

    const unsubClasses = onSnapshot(doc(db, "Settings", "classOptions"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        classesData = (data.options as string[]) ?? DEFAULT_CLASSES;
      }
      gotClasses = true;
      tryBuild();
    });

    const unsubTypes = onSnapshot(doc(db, "Settings", "crepeTypes"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        typesRaw = (data.types as Array<{ name: string; imageUrl: string }>) ?? [];
      } else {
        typesRaw = [];
      }
      gotTypes = true;
      tryBuild();
    });

    return () => {
      unsubClasses();
      unsubTypes();
    };
  }, []);

  return { settings, loading };
}
