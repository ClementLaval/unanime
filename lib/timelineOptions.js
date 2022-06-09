export function setTimelineOptions(options){
  
  const delay = returnValue(options.delay) || 0;
  const endDelay = returnValue(options.endDelay) || 0;
  const autoplay = returnValue(options.autoplay) || false; 
  const direction = returnValue(options.direction) || 'normal'; 
  const iterations = returnValue(options.iterations) || 1;

  return { delay, endDelay, autoplay, direction, iterations };  
}

function returnValue(input){
  if(typeof input === 'function'){
    return input();
    
  }else if(typeof input === 'number'){
    if(input === Infinity) return Infinity;
    return Number(input);
    
  }else if(typeof input === 'string'){
    return String(input);

  }else if(typeof input === 'boolean'){
    return input;
  }  
}