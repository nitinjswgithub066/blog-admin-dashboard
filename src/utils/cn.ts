/* eslint-disable */
export function cn(...classes: any[]): string {
  return classes.filter(Boolean).join(' ');
}
