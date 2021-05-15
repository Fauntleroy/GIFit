export class NoVideoFoundError extends Error {}
export class VideoNotValidError extends Error {}
export class VideoOriginMismatchError extends Error {
  constructor (videoSrc) {
    const message = 'Video origin mismatch';
    super(message);
    this.name = this.constructor.name;
    this.videoSrc = videoSrc;
  }
}
export class VideoSrcInvalidError extends Error {}
