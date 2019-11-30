import PropTypes from 'prop-types';
import React from 'react';

const DEFAULT_IMAGE_DISPLAY_WIDTH = 240;

function Progress (props) {
  let imageUrl, progressElementsStyle;

  if (props.image) {
    // Prepare a height proportional to the width the image will be displayed at
    // nasty but necessary for the effect at the end of GIF creation
    const imageDisplayHeight = DEFAULT_IMAGE_DISPLAY_WIDTH * (props.image.height / props.image.width);
    imageUrl = URL.createObjectURL(props.image.blob);
    progressElementsStyle = {
      height: imageDisplayHeight
    };
  }

  function handleCloseClick (event) {
    event.preventDefault();
    props.onCloseClick();
  }

  return (
    <div className="gifit-progress">
      <a
        className="gifit-progress__close"
        onClick={handleCloseClick} />
      <div className="gifit-progress__details">
        <div className="gifit-progress__status">{props.status}</div>
        <div className="gifit-progress__elements" style={progressElementsStyle}>
          <progress
            className="gifit-progress__progress"
            value={props.percent}
            max="100" />
          <img className="gifit-progress__result" src={imageUrl} />
        </div>
        <a
          className="gifit-progress__save gifit__button"
          href={imageUrl}
          download={`gifit_${Date.now()}.gif`}>
          Save GIF
        </a>
      </div>
    </div>
  );
}

Progress.propTypes = {
  image: PropTypes.shape({
    blob: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number
  }),
  onCloseClick: PropTypes.func.isRequired,
  percent: PropTypes.number,
  status: PropTypes.string
};

Progress.defaultProps = {
  image: null,
  percent: 0,
  status: null
};

export default Progress;
