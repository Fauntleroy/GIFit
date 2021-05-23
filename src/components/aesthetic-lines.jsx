import React from 'react';
import PropTypes from 'prop-types';

import * as css from './aesthetic-lines.module.css';
import useFrameRate from '$hooks/use-frame-rate';

import PathLine from '$components/pathline.jsx';

const LABEL_Y_OFFSET = 24;

function AestheticLines (props) {
  const {
    widthRef, widthBarRef,
    heightRef, heightBarRef,
    startRef, endRef, timeBarRef
  } = props;

  if (!widthRef.current || !timeBarRef.current) {
    return <svg />;
  }

  useFrameRate(60);
  const rangeElement = timeBarRef.current.querySelector('.range');
  const widthElement = widthRef.current;
  const widthBarElement = widthBarRef.current;

  return (
    <svg
      className={css.aestheticLines}>
      <circle
        cx={widthElement.offsetLeft}
        cy={widthElement.offsetTop + LABEL_Y_OFFSET}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <PathLine
        points={[
          { x: widthElement.offsetLeft,
            y: widthElement.offsetTop + LABEL_Y_OFFSET },
          { x: widthElement.offsetLeft,
            y: widthBarElement.offsetTop - 15 },
          { x: widthBarElement.offsetLeft + (widthBarElement.offsetWidth / 2),
            y: widthBarElement.offsetTop - 15 },
          { x: widthBarElement.offsetLeft + (widthBarElement.offsetWidth / 2),
            y: widthBarElement.offsetTop + widthBarElement.offsetHeight }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />

      <circle
        cx={heightRef.current.offsetLeft}
        cy={heightRef.current.offsetTop + LABEL_Y_OFFSET}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <PathLine
        points={[
          { x: heightRef.current.offsetLeft,
            y: heightRef.current.offsetTop + LABEL_Y_OFFSET },
          { x: heightRef.current.offsetLeft,
            y: heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2) },
          { x: heightBarRef.current.offsetLeft + heightBarRef.current.offsetWidth,
            y: heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2) }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />

      <circle
        cx={startRef.current.offsetLeft}
        cy={startRef.current.offsetTop + LABEL_Y_OFFSET + 3}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <PathLine
        points={[
          { x: startRef.current.offsetLeft,
            y: startRef.current.offsetTop + LABEL_Y_OFFSET + 3 },
          { x: startRef.current.offsetLeft,
            y: startRef.current.offsetTop + LABEL_Y_OFFSET - 17 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft,
            y: startRef.current.offsetTop + LABEL_Y_OFFSET - 17 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft,
            y: timeBarRef.current.offsetTop + timeBarRef.current.offsetHeight }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />

      <circle
        cx={endRef.current.offsetLeft}
        cy={endRef.current.offsetTop + LABEL_Y_OFFSET + 3}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <PathLine
        points={[
          { x: endRef.current.offsetLeft,
            y: endRef.current.offsetTop + LABEL_Y_OFFSET + 3 },
          { x: endRef.current.offsetLeft,
            y: endRef.current.offsetTop + LABEL_Y_OFFSET - 21 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft + rangeElement.offsetWidth,
            y: endRef.current.offsetTop + LABEL_Y_OFFSET - 21 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft + rangeElement.offsetWidth,
            y: timeBarRef.current.offsetTop + timeBarRef.current.offsetHeight }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />
    </svg>
  );
}

AestheticLines.propTypes = {
  widthRef: PropTypes.object.isRequired,
  widthBarRef: PropTypes.object.isRequired,
  heightRef: PropTypes.object.isRequired,
  heightBarRef: PropTypes.object.isRequired,
  startRef: PropTypes.object.isRequired,
  endRef: PropTypes.object.isRequired,
  timeBarRef: PropTypes.object.isRequired
};

export default AestheticLines;
