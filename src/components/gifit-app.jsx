import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@emotion/css';
import { animated, useTransition } from 'react-spring';

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
  const appTransition = useTransition(props.active, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 1,
      tension: 750,
      friction: 35
    }
  });

  function handleCloseClick (event) {
    event.preventDefault();
    props.onClose();
  }

  return appTransition((styles, item) => {
    return item && (
      <animated.div
        className={cx(gifitAppClassName, 'gifit-app')}
        style={{ ...styles }}>
        <div className="actions">
          <Button
            type="button"
            onClick={handleCloseClick}
            icon={<Times />}>
            Close GIFit
          </Button>
        </div>
        <GifGenerationSystem />
      </animated.div>
    );
  });
}

GifitApp.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

GifitApp.defaultProps = {
  active: false
};

export default GifitApp;
