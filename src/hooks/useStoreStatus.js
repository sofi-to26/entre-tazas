import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../db/firebaseConfig';

/**
 * Hook para saber si el local está abierto ahora mismo,
 * y para leer el modo "Cerrado temporalmente" desde Firestore.
 */
export const useStoreStatus = () => {
  const [tempClosed, setTempClosed] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Escuchar el flag de cierre temporal desde Firestore
  useEffect(() => {
    if (!db) { setLoadingStatus(false); return; }
    const ref = doc(db, 'config', 'storeStatus');
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setTempClosed(snap.data().tempClosed === true);
      } else {
        setTempClosed(false);
      }
      setLoadingStatus(false);
    }, () => setLoadingStatus(false));
    return () => unsub();
  }, []);

  // Calcular si está abierto según el horario
  const isOpenNow = () => {
    const now = new Date();
    // Venezuela (UTC-4)
    const utcOffset = -4;
    const localHour = now.getUTCHours() + utcOffset;
    const localMinutes = now.getUTCMinutes();
    const day = now.getUTCDay(); // 0=Dom, 1=Lun ... 6=Sab

    // Horario: Lun-Jue 6:30 AM - 7:00 PM | Vie-Dom 7:30 AM - 9:00 PM
    const timeInMinutes = ((localHour + 24) % 24) * 60 + localMinutes;

    if (day >= 1 && day <= 4) {
      // Lunes a Jueves: 6:30 - 19:00
      return timeInMinutes >= 6 * 60 + 30 && timeInMinutes < 19 * 60;
    } else {
      // Viernes, Sábado, Domingo: 7:30 - 21:00
      return timeInMinutes >= 7 * 60 + 30 && timeInMinutes < 21 * 60;
    }
  };

  const openNow = !tempClosed && isOpenNow();

  return { openNow, tempClosed, loadingStatus };
};
