import React from 'react';
import PropTypes from 'prop-types';

import * as css from './aesthetic-lines.module.css';
import useFrameRate from '$hooks/use-frame-rate';

import PathLine from '$components/pathline.jsx';

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

  return (
    <svg
      className={css.aestheticLines}>
      <PathLine
        points={[
          { x: widthRef.current.offsetLeft + (widthRef.current.offsetWidth / 2),
            y: widthRef.current.offsetTop },
          { x: widthRef.current.offsetLeft + (widthRef.current.offsetWidth / 2),
            y: widthBarRef.current.offsetTop - 15 },
          { x: widthBarRef.current.offsetLeft + (widthBarRef.current.offsetWidth / 2),
            y: widthBarRef.current.offsetTop - 15 },
          { x: widthBarRef.current.offsetLeft + (widthBarRef.current.offsetWidth / 2),
            y: widthBarRef.current.offsetTop }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />
      <PathLine
        points={[
          { x: heightRef.current.offsetLeft + (heightRef.current.offsetWidth / 2),
            y: heightRef.current.offsetTop },
          { x: heightRef.current.offsetLeft + (heightRef.current.offsetWidth / 2),
            y: heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2) },
          { x: heightBarRef.current.offsetLeft + (heightBarRef.current.offsetWidth / 2),
            y: heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2) }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />
      <PathLine
        points={[
          { x: startRef.current.offsetLeft + (startRef.current.offsetWidth / 2),
            y: startRef.current.offsetTop },
          { x: startRef.current.offsetLeft + (startRef.current.offsetWidth / 2),
            y: startRef.current.offsetTop - 8 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft,
            y: startRef.current.offsetTop - 8 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft,
            y: timeBarRef.current.offsetTop + timeBarRef.current.offsetHeight }
        ]}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none"
        r={5} />
      <PathLine
        points={[
          { x: endRef.current.offsetLeft + (endRef.current.offsetWidth / 2),
            y: endRef.current.offsetTop },
          { x: endRef.current.offsetLeft + (endRef.current.offsetWidth / 2),
            y: endRef.current.offsetTop - 12 },
          { x: timeBarRef.current.offsetLeft + rangeElement.offsetLeft + rangeElement.offsetWidth,
            y: endRef.current.offsetTop - 12 },
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
