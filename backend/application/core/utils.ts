/**
 * Core utility functions used across the application layer.
 */

/**
 * Returns `true` when the value is `null` or `undefined`.
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Returns `true` when the value is neither `null` nor `undefined`.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Strips `undefined` entries from a plain object (shallow).
 * Useful for building partial update payloads.
 */
export function omitUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

/**
 * Type-safe `Object.keys`.
 */
export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Clamps `value` between `min` and `max` (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a simple random hex string of the given byte-length.
 * Not cryptographically secure -- use `crypto.randomUUID()` for IDs.
 */
export function randomHex(bytes = 16): string {
  return Array.from({ length: bytes }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0'),
  ).join('');
}

/**
 * Sleeps for the given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalises pagination parameters, ensuring sane defaults and boundaries.
 */
export function normalisePagination(
  page?: number,
  perPage?: number,
): { page: number; per_page: number; offset: number } {
  const p = clamp(page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const pp = clamp(perPage ?? 20, 1, 100);
  return { page: p, per_page: pp, offset: (p - 1) * pp };
}
