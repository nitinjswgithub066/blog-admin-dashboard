export function generateCategoryIcon(categoryName: string): string {
  if (!categoryName) return '?';
  return categoryName.charAt(0).toUpperCase();
}
