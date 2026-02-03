import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ThoughtData {
  description: string;
  location: { lat: number; lng: number };
  userId?: string;
  userPhoto?: string;
  created_at?: string;
  expires_at?: string;
}

// Создание мысли в Firestore
export async function createThought(data: ThoughtData) {
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 60 * 60 * 1000)); // 1 час жизни
  return addDoc(collection(db, 'thoughts'), {
    ...data,
    createdAt: serverTimestamp(),
    expiresAt,
  });
}

// Подписка на мысли
export function subscribeThoughts(
  onChange: (thoughts: (ThoughtData & { id: string })[]) => void,
) {
  const q = query(
    collection(db, 'thoughts'),
    where('expiresAt', '>', new Date()),
  );

  return onSnapshot(q, (snapshot) => {
    const thoughts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (ThoughtData & { id: string })[];
    onChange(thoughts);
  });
}
