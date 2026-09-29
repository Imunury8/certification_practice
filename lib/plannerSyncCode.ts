/** A sync code is a private bearer credential; never include it in a URL. */
export function normalizeSyncCode(input: string): string | null {
  const code = input.trim().toUpperCase();
  return /^SP-[A-F0-9]{8}(?:-[A-F0-9]{8}){3}$/.test(code) ? code : null;
}
