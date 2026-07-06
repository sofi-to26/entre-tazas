import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../db/firebaseConfig';

/**
 * Returns a real-time map of { [productId]: boolean }
 * true = available, false = agotado
 */
export const useInventory = () => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const unsub = onSnapshot(collection(db, 'inventory'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data().available !== false; });
      setInventory(map);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Default true if product not in DB yet (safe fallback)
  const isAvailable = (id) => inventory[id] !== false;

  return { inventory, loading, isAvailable };
};
