import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';

import Button from '$components/button.jsx';
import GifGenerationSystem from '$components/gif-generation-system.jsx';

import Times from '$icons/times.svg';

const gifitAppClassName = css`
  .actions {
    position: absolute;
    top: 30px;
    right: 30px;
  }
`;

function GifitApp (props) {
  function handleCloseClick (event) {
    event.preventDefault();
    props.onClose();
  }

  return (
    <div
      className={cx(gifitAppClassName, 'gifit-app')}
      style={{ display: props.active ? 'flex' : 'none' }}>
      {props.active &&
        <>
          <div className="actions">
            <Button
              type="button"
              onClick={handleCloseClick}
              icon={<Times />}>
              Close GIFit
            </Button>
          </div>
          <GifGenerationSystem />
        </>
      }
    </div>
  );
}

GifitApp.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

GifitApp.defaultProps = {
  active: false
};

export default GifitApp;
