import { play, pause, restart, cancel, reset, finish, reverse, seek, scrub } from './player.js';
import { onFinish, onReady, onCancel, onRemove, onPlay, onPause } from './events.js';
import { getTargets } from './targets.js';
import { getOptionsDisplay } from './options.js';
import { getDuration, getPlayState, getCurrentIteration, getPlaybackRate, getProgress } from './getters.js';
import { setPlaybackRate, setWillChange, setDirection, setCommitStyles, setInitStyles, setObserver } from './setters.js';
import { timeline } from './timeline.js';
import { initAnimations } from './initAnimations.js';
import { initFeatures } from './initFeatures.js';
import { refresh as refreshObserver } from './observer.js';

function animate(targets, keyframes, options){
  
  const { animationsArray, optionsComputed } = initAnimations(targets, keyframes, options);
  
  const animate = {
    // Info
    targets: getTargets(animationsArray, options.mergeTargets),
    keyframes: keyframes,
    options: getOptionsDisplay(options, optionsComputed),
    // Player
    play: (index) => play(index, animationsArray, animate.onPlayAction),
    pause: (index) => pause(index, animationsArray, animate.onPauseAction), 
    restart: (index) => restart(index, animationsArray),
    cancel: (index) => cancel(index, animationsArray),
    reset: (index) => reset(index, animationsArray),
    finish: (index) => finish(index, animationsArray),
    reverse: (index) => reverse(index, animationsArray),
    seek: (value, index) => seek(value, index, animationsArray),
    scrub: (value, pinOptions, index) => {if(!animate.useScrub)scrub(pinOptions, index, animate); animate.useScrub(value, index)}, 
    // Events
    onReady: (action) => onReady(action, animationsArray),
    onFinish: (action, index) => onFinish(action, index, animationsArray),
    onCancel: (action) => onCancel(action, animationsArray),
    onRemove: (action) => onRemove(action, animationsArray), //TO DO
    onPlay: (action) => onPlay(action, animate),  
    onPause: (action) => onPause(action, animate),
    // Getters
    getDuration: () => getDuration(animationsArray),
    getPlayState: () => getPlayState(animationsArray),
    getCurrentIteration: () => getCurrentIteration(animationsArray),
    getPlaybackRate: () => getPlaybackRate(animate),
    getProgress: () => getProgress(animationsArray), //TO DO
    // Setters
    setPlaybackRate: (value) => setPlaybackRate(value, animationsArray, animate),
    setWillChange: (status) => setWillChange(status, animationsArray, animate),
    setDirection: (value) => setDirection(value, animationsArray, animate),
    setCommitStyles: (status) => setCommitStyles(status, animationsArray, animate),
    setInitStyles: (status) => setInitStyles(status, animationsArray, animate), 
    setObserver: (options) => setObserver(options, animate),
    refreshObserver: (delay) => refreshObserver(delay, animate)
  }
   
  // Features
  initFeatures(optionsComputed, animate);
  
  return animate;
}

export { animate, timeline };