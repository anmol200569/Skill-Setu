/**
 * Strips the [INACTIVE] prefix from question text before presenting it to users.
 */
export function stripInactivePrefix(text?: string | null): string {
  if (!text) return '';
  return text.replace(/^\[INACTIVE\]\s*/i, '');
}
