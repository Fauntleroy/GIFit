import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as css from './system-message.module.css';

function SystemMessage (props) {
  return (
    <div className={cx(css.systemMessage, {
      [css.systemMessageError]: props.type === 'error'
    })}>
      {props.title && <div className={css.title}>{props.title}</div>}
      <div className={css.body}>{props.children}</div>
      <div className={css.signature}>{props.signature}</div>
    </div>
  );
}

SystemMessage.defaultProps = {
  signature: 'TK',
  title: null,
  type: 'status'
};

SystemMessage.propTypes = {
  children: PropTypes.node.isRequired,
  signature: PropTypes.node,
  title: PropTypes.string,
  type: PropTypes.oneOf(['error', 'status'])
};

export default SystemMessage;
