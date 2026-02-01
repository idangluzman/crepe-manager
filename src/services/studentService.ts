import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function addStudent(name: string, className: string): Promise<string> {
  const docRef = await addDoc(collection(db, "Students"), {
    name,
    class: className,
    totalCount: 0,
  });
  return docRef.id;
}
