import { useState, useEffect } from 'react';

export function useCurrentTime(refreshIntervalMs = 1000) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [refreshIntervalMs]);

  return currentTime;
}
