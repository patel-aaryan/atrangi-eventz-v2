import { useState } from "react";

export function useSessionStorage(key: string, initialValue: boolean = false) {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key) === "true";
    }
    return initialValue;
  });

  const setStoredValue = (newValue: boolean) => {
    setValue(newValue);
    sessionStorage.setItem(key, String(newValue));
  };

  return [value, setStoredValue] as const;
}
