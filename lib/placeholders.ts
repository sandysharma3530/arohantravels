/** Returns false when a config value still contains REPLACE_* placeholders. */
export function isConfigured(value: string) {
  return !value.includes("REPLACE_");
}
