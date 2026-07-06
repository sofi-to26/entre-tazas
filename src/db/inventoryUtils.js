import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { menuData } from '../data/menuData';

/**
 * Seeds the `inventory` collection in Firestore with all products set to available.
 * Safe to call multiple times — only writes if the document doesn't exist yet.
 */
export const seedInventory = async () => {
  if (!db) return;
  const allProducts = [
    ...menuData.desayunos,
    ...menuData.meriendas,
    ...menuData.bebidas,
  ];

  for (const item of allProducts) {
    const ref = doc(db, 'inventory', item.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        id: item.id,
        nombre: item.nombre,
        categoria: item.id.startsWith('d') ? 'desayunos' : item.id.startsWith('m') ? 'meriendas' : 'bebidas',
        available: true,
      });
    }
  }
};

/**
 * Subscribe to real-time inventory updates.
 * Returns a map { [productId]: boolean }
 */
export { db };
