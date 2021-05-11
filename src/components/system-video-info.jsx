import React from 'react';

import * as css from './system-video-info.module.css';

function SystemVideoInfo (props) {
  const { video } = props;

  if (!video) {
    return <></>;
  }

  return (
    <div className={css.videoInfo}>
      <dl className={css.infoList}>
        <dt className={css.infoListTerm}>w</dt>
        <dd className={css.infoListDetails}>
          <var className={css.value}>{video?.videoWidth}</var>
          <span className={css.unit}>px</span>
        </dd>
        <dt className={css.infoListTerm}>h</dt>
        <dd className={css.infoListDetails}>
          <var className={css.value}>{video?.videoHeight}</var>
          <span className={css.unit}>px</span>
        </dd>
      </dl>
    </div>
  );
}

export default SystemVideoInfo;
