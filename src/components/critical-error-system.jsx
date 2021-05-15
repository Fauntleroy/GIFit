import React from 'react';
import PropTypes from 'prop-types';

import * as css from './critical-error-system.module.css';
import { NoVideoFoundError, VideoNotValidError, VideoOriginMismatchError, VideoSrcInvalidError } from '$utils/errors';

function getErrorDisplayData (error) {
  switch (true) {
    case error instanceof NoVideoFoundError:
      return {
        title: 'No Video Found',
        body: <>GIFit was <strong>unable to find any videos on this page</strong>. Sometimes this is because there are things that look similar to videos, but aren't. Click the video's play button and try starting GIFit again</>
      };
    case error instanceof VideoNotValidError:
      return {
        title: 'Video Not Valid',
        body: <>GIFit can't work with this video because it <strong>has no duration</strong>. Click the video's play button and <strong>try starting GIFit again</strong>. Surely it'll have a duration if it actually plays, right?</>
      };
    case error instanceof VideoOriginMismatchError:
      return {
        title: 'Video Origin Mismatch',
        body: <>This video is being <strong>served from another domain name</strong>, so the browser won't let GIFit interact with it. If you'd like, you can try again <a href={error.videoSrc} target="_blank" rel="noreferrer">At the video's actual URL</a>.</>
      };
    case error instanceof VideoSrcInvalidError:
      return {
        title: 'Video Source Invalid',
        body: <>If the video <strong>doesn't have a valid source URL</strong>, this happens. If the video works, but you see this error, please <a href="https://github.com/Fauntleroy/GIFit/issues" target="_blank" rel="noreferrer">file an issue on GitHub</a> and let me know what happened.</>
      };
    default:
      return {
        title: 'Unanticipated Error',
        body: <>This message appears when an <strong>error I haven't accounted for</strong> comes up. Please <a href="https://github.com/Fauntleroy/GIFit/issues" target="_blank" rel="noreferrer">file an issue on GitHub</a> and help me squash this bug (or at least write a better error message)!</>
      };
  }
}

function CriticalErrorSystem (props) {
  const { title, body } = getErrorDisplayData(props.error);

  return (
    <div className={css.criticalErrorSystem}>
      <div className={css.label}>Critical Error System</div>
      <div className={css.errorTitle}>{title}</div>
      <div className={css.errorBody}>{body}</div>
      <div className={css.signature}>{props.signature}</div>
    </div>
  );
}

CriticalErrorSystem.propTypes = {
  error: PropTypes.object.isRequired,
  signature: PropTypes.string
};

CriticalErrorSystem.defaultProps = {
  signature: 'TK'
};

export default CriticalErrorSystem;
