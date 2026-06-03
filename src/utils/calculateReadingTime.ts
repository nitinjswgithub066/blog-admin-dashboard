export function calculateReadingTime(text: string): number {
  const wpm = 225; // Average adult reading speed
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time || 1; // Minimum 1 minute
}
