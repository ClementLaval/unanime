import { play, pause, restart, cancel, reset, finish, reverse, seek } from './player.js';
import { onfinish, onready, oncancel, onremove, onplay, onpause } from './events.js';
import { getTargets } from './targets.js';
import { getOptionsDisplay } from './options.js';
import { getDuration, getPlayState, getCurrentIteration, getPlaybackRate, getProgress } from './getters.js';
import { setPlaybackRate, setWillChange, setDirection, setCommitStyles, setInitStyles, setObserver } from './setters.js';
import { timeline } from './timeline.js';
import { initAnimations } from './initAnimations.js';
import { initFeatures } from './initFeatures.js';

function animate(targets, keyframes, options){
  
  const { animationsArray, optionsComputed } = initAnimations(targets, keyframes, options);
  
  const animate = {
    // Info
    targets: getTargets(animationsArray),
    keyframes: keyframes,
    options: getOptionsDisplay(options, optionsComputed),
    // Player
    play: () => play(animationsArray, animate.onplayAction),
    pause: () => pause(animationsArray, animate.onpauseAction), 
    restart: () => restart(animationsArray),
    cancel: () => cancel(animationsArray),
    reset: () => reset(animationsArray),
    finish: () => finish(animationsArray),
    reverse: () => reverse(animationsArray),
    seek: (value) => seek(value, animationsArray), //TO DO
    // Events
    onready: (action) => onready(action, animationsArray),
    onfinish: (action) => onfinish(action, animationsArray),
    oncancel: (action) => oncancel(action, animationsArray),
    onremove: (action) => onremove(action, animationsArray), //TO DO
    onplay: (action) => onplay(action, animate),  
    onpause: (action) => onpause(action, animate),
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
    setObserver: (options) => setObserver(options, animate)
  }
   
  // Features
  initFeatures(optionsComputed, animate);
  
  return animate;
}

export { animate, timeline };