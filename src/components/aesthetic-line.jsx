import React from 'react';
import PropTypes from 'prop-types';

const NORMAL_OFFSET = 50;

// must be used within AestheticLines
function AestheticLine (props) {
  const { start, end, normals, normalOffset } = props;
  const controlA = [start[0], start[1]];
  if (normals[0] === 0) controlA[1] -= normalOffset;
  if (normals[0] === 90) controlA[0] += normalOffset;
  if (normals[0] === 180) controlA[1] += normalOffset;
  if (normals[0] === 270) controlA[0] -= normalOffset;
  const controlB = [end[0], end[1]];
  if (normals[1] === 0) controlB[1] -= normalOffset;
  if (normals[1] === 90) controlB[0] += normalOffset;
  if (normals[1] === 180) controlB[1] += normalOffset;
  if (normals[1] === 270) controlB[0] -= normalOffset;

  return (
    <>
      <circle
        cx={start[0]}
        cy={start[1]}
        r="2.5"
        fill="none"
        stroke="var(--color-nightshade)"
        strokeWidth="2" />
      <path
        d={`
          M${start[0]} ${start[1]}
          C${controlA[0]},${controlA[1]}
          ${controlB[0]},${controlB[1]}
          ${end[0]},${end[1]}
        `}
        stroke="var(--color-subsystem)"
        strokeDasharray="1,2"
        strokeWidth="1"
        fill="none" />
      <circle
        cx={end[0]}
        cy={end[1]}
        r="2.5"
        fill="none"
        stroke="var(--color-nightshade)"
        strokeWidth="2" />
    </>
  );
}

AestheticLine.defaultProps = {
  normalOffset: NORMAL_OFFSET
};

AestheticLine.propTypes = {
  start: PropTypes.arrayOf(PropTypes.number).isRequired,
  end: PropTypes.arrayOf(PropTypes.number).isRequired,
  normals: PropTypes.arrayOf(PropTypes.oneOf(0, 90, 180, 270)).isRequired,
  normalOffset: PropTypes.number
};

export default AestheticLine;
