export default function toTimeString (timeInSeconds) {
  const hours = Math.floor(timeInSeconds / (60 * 60));
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = (timeInSeconds % 60);

  let timeString = minutes && seconds < 10
    ? '0' + seconds.toFixed(2)
    : seconds.toFixed(2);
  if (minutes) {
    timeString = hours
      ? `${minutes.toPrecision(2)}:${timeString}`
      : `${minutes}:${timeString}`;
  }
  if (hours) {
    timeString = `${hours}:${timeString}`;
  }

  return timeString;
}
