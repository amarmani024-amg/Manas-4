/**
 * Mobile vibration helper with safe feature detection
 */
export function triggerVibration(pattern: number | number[] = 50) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors on unsupported platforms
    }
  }
}
