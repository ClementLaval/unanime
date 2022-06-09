import { autoplay } from './timelineFeatures';

export function initTimelineFeatures(options, timeline){  
  // playbackRate(options.playbackRate, timeline);
  autoplay(options.autoplay, timeline);
}