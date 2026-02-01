import { useState, useEffect, useRef, useCallback } from "react";

interface UseReservationTimerProps {
  duration: number; // Duration in milliseconds
  onExpire: () => void;
  enabled?: boolean;
  startTime?: number | null; // Optional start timestamp for persistence across refreshes
}

interface UseReservationTimerReturn {
  timeRemaining: number;
  isExpired: boolean;
  minutes: number;
  seconds: number;
  isWarning: boolean;
  percentRemaining: number;
  isLoading: boolean;
}

const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export function useReservationTimer({
  duration,
  onExpire,
  enabled = true,
  startTime = null,
}: UseReservationTimerProps): UseReservationTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);
  const startTimeRef = useRef<number | null>(startTime);
  const hasExpiredRef = useRef(false);

  // Store onExpire in a ref to avoid it triggering effect re-runs
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Stable callback that reads from the ref
  const handleExpire = useCallback(() => {
    onExpireRef.current();
  }, []);

  // Calculate loading state based on enabled
  const isLoading = !enabled;

  useEffect(() => {
    if (!enabled) return;

    // Use provided startTime or set new one
    if (!startTimeRef.current) startTimeRef.current = startTime || Date.now();

    // Calculate initial remaining time immediately
    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    const initialRemaining = duration - elapsed;

    if (initialRemaining <= 0) {
      // Already expired - schedule state updates
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setIsExpired(true);
          setTimeRemaining(0);
          handleExpire();
        }, 0);
      }
      return;
    }

    // Schedule state update
    setTimeout(() => {
      setTimeRemaining(initialRemaining);
    }, 0);

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        // Reservation expired
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          setIsExpired(true);
          setTimeRemaining(0);
          handleExpire();
        }
        clearInterval(intervalId);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration, handleExpire, enabled, startTime]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const isWarning = timeRemaining < WARNING_THRESHOLD && timeRemaining > 0;
  const percentRemaining = (timeRemaining / duration) * 100;

  return {
    timeRemaining,
    isExpired,
    minutes,
    seconds,
    isWarning,
    percentRemaining,
    isLoading,
  };
}
