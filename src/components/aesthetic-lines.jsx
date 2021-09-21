import React from 'react';
import PropTypes from 'prop-types';

import AestheticLine from './aesthetic-line.jsx';

import * as css from './aesthetic-lines.module.css';
import useFrameRate from '$hooks/use-frame-rate';

function AestheticLines (props) {
  const {
    workspaceRef,
    widthRef, heightRef,
    qualityRef, frameRateRef,
    startRef, endRef, timeBarRef
  } = props;

  if (!widthRef.current || !timeBarRef.current) {
    return <svg />;
  }

  useFrameRate(60);
  const rangeEl = timeBarRef.current.querySelector('.range');
  const widthEl = widthRef.current;
  const heightEl = heightRef.current;
  const startEl = startRef.current;
  const endEl = endRef.current;
  const timeBarEl = timeBarRef.current;
  const workspaceEl = workspaceRef.current;
  const qualityEl = qualityRef.current;
  const frameRateEl = frameRateRef.current;

  return (
    <svg
      className={css.aestheticLines}>
      <AestheticLine
        start={[widthEl.offsetLeft + (widthEl.offsetWidth / 2), widthEl.offsetTop + (widthEl.offsetHeight / 2)]}
        end={[workspaceEl.offsetLeft + (workspaceEl.offsetWidth / 2), workspaceEl.offsetTop]}
        normals={[0, 0]} />
      <AestheticLine
        start={[heightEl.offsetLeft + (heightEl.offsetWidth / 2), heightEl.offsetTop + (heightEl.offsetHeight / 2)]}
        end={[workspaceEl.offsetLeft, workspaceEl.offsetTop + (workspaceEl.offsetHeight / 2)]}
        normals={[0, 270]} />
      <AestheticLine
        start={[startEl.offsetLeft + (startEl.offsetWidth / 2), startEl.offsetTop + (startEl.offsetHeight / 2)]}
        end={[timeBarEl.offsetLeft + rangeEl.offsetLeft, timeBarEl.offsetTop + timeBarEl.offsetHeight]}
        normals={[0, 180]} />
      <AestheticLine
        start={[endEl.offsetLeft + (endEl.offsetWidth / 2), endEl.offsetTop + (endEl.offsetHeight / 2)]}
        end={[timeBarEl.offsetLeft + rangeEl.offsetLeft + rangeEl.offsetWidth, timeBarEl.offsetTop + timeBarEl.offsetHeight]}
        normals={[0, 180]} />
      <AestheticLine
        start={[endEl.offsetLeft + (endEl.offsetWidth / 2), endEl.offsetTop + (endEl.offsetHeight / 2)]}
        end={[timeBarEl.offsetLeft + rangeEl.offsetLeft + rangeEl.offsetWidth, timeBarEl.offsetTop + timeBarEl.offsetHeight]}
        normals={[0, 180]} />
      <AestheticLine
        start={[qualityEl.offsetLeft + (qualityEl.offsetWidth / 2), qualityEl.offsetTop + (qualityEl.offsetHeight / 2)]}
        end={[workspaceEl.offsetLeft + workspaceEl.offsetWidth, workspaceEl.offsetTop + ((workspaceEl.offsetHeight / 3))]}
        normals={[270, 90]} />
      <AestheticLine
        start={[frameRateEl.offsetLeft + (frameRateEl.offsetWidth / 2), frameRateEl.offsetTop + (frameRateEl.offsetHeight / 2)]}
        end={[workspaceEl.offsetLeft + workspaceEl.offsetWidth, workspaceEl.offsetTop + ((workspaceEl.offsetHeight / 3) * 2)]}
        normals={[270, 90]} />
    </svg>
  );
}

AestheticLines.propTypes = {
  widthRef: PropTypes.object.isRequired,
  workspaceRef: PropTypes.object.isRequired,
  heightRef: PropTypes.object.isRequired,
  startRef: PropTypes.object.isRequired,
  endRef: PropTypes.object.isRequired,
  timeBarRef: PropTypes.object.isRequired,
  qualityRef: PropTypes.object.isRequired,
  frameRateRef: PropTypes.object.isRequired
};

export default AestheticLines;
