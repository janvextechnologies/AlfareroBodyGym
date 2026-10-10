"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Muestra el año actual calculado en el cliente (evita el prerender con
 * `new Date()` en el servidor y no provoca desajustes de hidratación).
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );

  return <>{year ?? ""}</>;
}
