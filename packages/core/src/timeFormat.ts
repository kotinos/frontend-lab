/** Formats total seconds as MM:SS for Pomodoro-style displays. */
export function formatMmSs(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '00:00'
  }
  const whole = Math.floor(totalSeconds)
  const minutes = Math.floor(whole / 60)
  const seconds = whole % 60
  return `${pad2(minutes)}:${pad2(seconds)}`
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}
