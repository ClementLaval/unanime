import {easing as setEasing} from './easing.js';

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
    return stagger(input, index, targetIndexLength);
  }
}

export function stagger(input, index, targetIndexLength){
  const init = input.default || 0;
  const stagger = input.stagger || 0;
  const from = input.from || 'start'; // 'start, 'center', 'end'
  const direction = input.direction || 'normal'; // 'normal', 'reverse'
  
  if((from === 'start' && direction === 'normal') || (from === 'end' && direction === 'reverse')){
    return init + (stagger * index); 
  }
  else if((from === 'end' && direction === 'normal') || (from === 'start' && direction === 'reverse')){
    return init + (stagger * (targetIndexLength - index));
  }
  else if(from === 'center' && direction === 'normal'){
    const arrayCenter = (targetIndexLength - 1) / 2;
    const gap = arrayCenter - index;
    return init + (stagger * Math.abs(gap));
  }
  else if(from === 'center' && direction === 'reverse'){
    let gap = [];
    [1, targetIndexLength].map(fromIndex => {
      gap.push(Math.abs(fromIndex - (index + 1)));
    })
    gap = Math.min(...gap);
    return init + (stagger * Math.abs(gap));
  } 
  else if(typeof from === 'number' && direction === 'normal'){
    const gap = from - (index + 1);
    return init + (stagger * Math.abs(gap));
  }
  else if(typeof from === 'number' && direction === 'reverse'){  
    const max = (targetIndexLength - 1) - from;
    const ratio = (index + 1) - from;
    const reverse = max - Math.abs(ratio);
    return init + (stagger * reverse);
  }
  else if(Array.isArray(from) && direction === 'normal'){
    let gap = [];
    from.map(fromIndex => {
      gap.push(Math.abs(fromIndex - (index + 1)));
    })
    gap = Math.min(...gap);
    return init + (stagger * Math.abs(gap));
  } 
  else if(Array.isArray(from) && direction === 'reverse'){
    let max = [];
    from.map(fromIndex => {
      max.push((targetIndexLength) - fromIndex);
    })
    max = Math.min(...max);

    let ratio = [];
    from.map(fromIndex => {
      ratio.push(Math.abs(fromIndex - (index + 1)));
    })
    ratio = Math.min(...ratio);
    
    const reverse = max - Math.abs(ratio);    
    
    return init + (stagger * reverse);
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
  }

  return optionsDisplay;
}

export function refreshOptionsDisplay(option, value, animate){
  animate.options[option] = value;
}