import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
export function useCurrentTime() {
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => { setNow(new Date()); const timer = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(timer); }, []));
  return now;
}
