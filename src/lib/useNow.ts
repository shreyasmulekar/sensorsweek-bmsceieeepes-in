import { useEffect, useState } from "react";

/**
 * Ticking clock for the browser. Starts as null so the server and the first
 * client render agree, then updates every second.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
