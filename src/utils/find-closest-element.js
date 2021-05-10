function findClosestElement (elements) {
  const windowCenterOrigin = [
    window.innerWidth / 2,
    window.innerHeight / 2
  ];
  let closestDistance = null;
  let closestElement = null;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const relativeCenterOrigin = [
      rect.x + (rect.width / 2),
      rect.y + (rect.height / 2)
    ];
    const totalDistanceFromCenter =
      Math.abs(windowCenterOrigin[0] - relativeCenterOrigin[0]) +
      Math.abs(windowCenterOrigin[1] - relativeCenterOrigin[1]);

    if (!closestElement || (totalDistanceFromCenter < closestDistance)) {
      closestElement = element;
      closestDistance = totalDistanceFromCenter;
    }
  });

  return closestElement;
}

export default findClosestElement;
