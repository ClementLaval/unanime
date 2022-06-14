import { autoplay } from './timelineFeatures.js';

export function initTimelineFeatures(options, timeline){  
  // playbackRate(options.playbackRate, timeline);
  autoplay(options.autoplay, timeline);
}