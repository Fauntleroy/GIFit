// Convert a timecode string, like 1:30, to a seconds number
function toSeconds (timeString) {
  let seconds = 0;
  const timeArray = timeString.split(':').reverse();

  for (let i = 0; i < timeArray.length; i++) {
    const timeSegment = parseFloat(timeArray[i]);
    switch (i) {
      case 0:
        seconds += timeSegment;
        break;
      case 1:
        seconds += timeSegment * 60;
        break;
      case 2:
        seconds += timeSegment * 60 * 60;
        break;
      default:
        break;
    }
  }

  return seconds;
}

export default toSeconds;
