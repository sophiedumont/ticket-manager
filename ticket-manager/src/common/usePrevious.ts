import { useEffect, useRef } from "react";

export function usePrevious<T>(value: any): T {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
}
