import { useState, useEffect } from "react";

export function useDebouncedSearchTerm(searchTerm: unknown, delay = 500) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof searchTerm === "string") {
        setDebouncedSearchTerm(searchTerm);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedSearchTerm;
}
