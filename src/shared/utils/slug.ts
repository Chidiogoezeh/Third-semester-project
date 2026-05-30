// src/shared/utils/slug.ts

export function generateSlug(
  title: string
): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return `${baseSlug}-${Date.now()}`;
}