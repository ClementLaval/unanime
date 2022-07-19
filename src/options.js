import { easing as setEasing } from './easing.js';
import { stagger } from './stagger.js';

export function setOptions(options, index, targetIndexLength){
  // Basic options
  const delay = returnValue(options.delay, index, targetIndexLength) || 0;
  const direction = returnValue(options.direction) || 'normal';
  const duration = returnValue(options.duration, index, targetIndexLength) || 1000;
  const easing = setEasing(options.easing, index, targetIndexLength);
  const endDelay = returnValue(options.endDelay, index, targetIndexLength) || 0;
  const fill = returnValue(options.fill) || 'both';
  const iterationStart = returnValue(options.iterationStart, index, targetIndexLength) || 0;
  const iterations = returnValue(options.iterations, index, targetIndexLength) || 1;
  const composite = returnValue(options.composite) || 'replace';
  const iterationComposite = returnValue(options.iterationComposite) || 'replace';

  // Extra options
  const autoplay = returnValue(options.autoplay, index, targetIndexLength) || false;
  const autocancel = returnValue(options.autocancel, index, targetIndexLength) || false;
  const playbackRate = returnValue(options.playbackRate, index, targetIndexLength) || 1;
  const willChange = returnValue(options.willChange, index, targetIndexLength) || false;  
  const commitStyles = returnValue(options.commitStyles, index, targetIndexLength) || false;
  const initStyles = returnValue(options.initStyles, index, targetIndexLength) || false;
  const mergeTargets = returnValue(options.mergeTargets, index, targetIndexLength) || false;
  const observer = (options.observer) || null;
  
  return {  
    delay, 
    direction, 
    duration, 
    easing, 
    endDelay, 
    fill, 
    iterationStart, 
    iterations, 
    composite, 
    iterationComposite, 
    autoplay,
    autocancel,
    playbackRate,
    willChange,
    commitStyles,
    initStyles,
    mergeTargets,
    observer
  };   
}  

function returnValue(input, index, targetIndexLength){
  if(typeof input === 'function'){
    return input();
    
  }else if(typeof input === 'number'){
    if(input === Infinity) return Infinity;
    return Number(input);
    
  }else if(typeof input === 'string'){
    return String(input);  

  }else if(typeof input === 'boolean'){
    return input;

  }else if(typeof input === 'object'){ 
    return stagger(input, index, targetIndexLength);
  }
}

export function getOptionsDisplay(options, optionsComputed){

  const optionsDisplay = {
    ...optionsComputed,
    easing: options.easing || 'linear',
    duration: options.duration || 1000,
    delay: options.delay || 0,
    endDelay: options.endDelay || 0,
    iterations: options.iterations || 1,   
    iterationStart: options.iterationStart || 0,
    observer: options.observer || null
  }

  return optionsDisplay;
}

export function refreshOptionsDisplay(option, value, animate){
  animate.options[option] = value;
}