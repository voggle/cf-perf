export function randomHexString(len: number): string {
  return crypto.getRandomValues(new Uint8Array((len + 1) / 2 | 0)).
      reduce((r, b) => r + b.toString(16).padStart(2, "0"), "").substring(0, len);
}

export function newArray<T>(len: number, filler: (i: number) => T): T[] {
  return Array(len).fill(null).map((_, i) => filler(i));
}