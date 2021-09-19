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
  const rangeEl = timeBarRef.current.querySelector('.range');
  const widthEl = widthRef.current;
  const widthBarEl = widthBarRef.current;

  return (
    <svg
      className={css.aestheticLines}>
      <circle
        cx={widthEl.offsetLeft}
        cy={widthEl.offsetTop + LABEL_Y_OFFSET}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <path
        d={`
          M${widthEl.offsetLeft} ${widthEl.offsetTop + LABEL_Y_OFFSET}
          C${widthEl.offsetLeft},${widthBarEl.offsetTop + widthBarEl.offsetHeight}
          ${widthEl.offsetLeft},${widthBarEl.offsetTop + widthBarEl.offsetHeight}
          ${widthBarEl.offsetLeft + (widthBarEl.offsetWidth / 2)},${widthBarEl.offsetTop + widthBarEl.offsetHeight}
        `}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none" />

      <circle
        cx={heightRef.current.offsetLeft}
        cy={heightRef.current.offsetTop + LABEL_Y_OFFSET}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <path
        d={`
          M${heightRef.current.offsetLeft} ${heightRef.current.offsetTop + LABEL_Y_OFFSET}
          C${heightRef.current.offsetLeft},${heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2)}
          ${heightRef.current.offsetLeft},${heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2)}
          ${heightBarRef.current.offsetLeft + heightBarRef.current.offsetWidth},${heightBarRef.current.offsetTop + (heightBarRef.current.offsetHeight / 2)}
        `}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none" />

      <circle
        cx={startRef.current.offsetLeft}
        cy={startRef.current.offsetTop + LABEL_Y_OFFSET + 3}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <path
        d={`
          M${startRef.current.offsetLeft} ${startRef.current.offsetTop + LABEL_Y_OFFSET + 3}
          C${timeBarRef.current.offsetLeft + rangeEl.offsetLeft},${startRef.current.offsetTop + LABEL_Y_OFFSET + 3}
          ${timeBarRef.current.offsetLeft + rangeEl.offsetLeft},${startRef.current.offsetTop + LABEL_Y_OFFSET + 3}
          ${timeBarRef.current.offsetLeft + rangeEl.offsetLeft},${timeBarRef.current.offsetTop + timeBarRef.current.offsetHeight}
        `}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none" />

      <circle
        cx={endRef.current.offsetLeft}
        cy={endRef.current.offsetTop + LABEL_Y_OFFSET + 3}
        r="1.5"
        fill="none"
        stroke="var(--color-subsystem)"
        strokeWidth="1" />
      <path
        d={`
          M${endRef.current.offsetLeft} ${endRef.current.offsetTop + LABEL_Y_OFFSET + 3}
          C${timeBarRef.current.offsetLeft + rangeEl.offsetLeft + rangeEl.offsetWidth},${endRef.current.offsetTop + LABEL_Y_OFFSET + 3}
          ${timeBarRef.current.offsetLeft + rangeEl.offsetLeft + rangeEl.offsetWidth},${endRef.current.offsetTop + LABEL_Y_OFFSET + 3}
          ${timeBarRef.current.offsetLeft + rangeEl.offsetLeft + rangeEl.offsetWidth},${timeBarRef.current.offsetTop + timeBarRef.current.offsetHeight}
        `}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none" />
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
