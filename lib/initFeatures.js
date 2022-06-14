import { autoplay, autocancel, playbackRate, willChange, commitStyles } from './features.js';

export function initFeatures(options, animate){  
  willChange(options.willChange, animate);
  playbackRate(options.playbackRate, animate);
  autoplay(options.autoplay, animate);
  autocancel(options.autocancel, animate);
  commitStyles(options.commitStyles, animate);
}