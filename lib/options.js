import {easing as setEasing} from './easing';

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
    commitStyles
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
    const init = input.default || 0;
    const stagger = input.stagger || 0; // Stagger
    const direction = input.direction || 'normal';

    if(direction === 'reverse'){
      return init + (stagger * (targetIndexLength - index));
    }

    return init + (stagger * index);     
  }
}

export function getOptionsDisplay(options, optionsComputed){

  const optionsDisplay = {
    ...optionsComputed,
    duration: options.duration || 0,
    delay: options.delay || 0,
    endDelay: options.endDelay || 0   
  }

  return optionsDisplay;
}

export function refreshOptionsDisplay(option, value, animate){
  animate.options[option] = value;
}