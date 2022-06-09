export function getTimelineDuration(animationsDuration, starter, options){
  const animationsLength = animationsDuration.length;
  const timelineDelay = options.delay;
  const timelineEndDelay = options.endDelay;
  let durationsArray = [];
  for(let i=0; i < animationsLength; i++){ 
    const animateWithDelay = animationsDuration[i] + starter[i];
    durationsArray.push(animateWithDelay);    
  }  
  const timelineDuration = timelineDelay + Math.max(...durationsArray) + timelineEndDelay;
  return timelineDuration;
}

export function getTotalTimelineDuration(timelineDuration, options){
  const totalTimelineDuration = timelineDuration * options.iterations;
  return totalTimelineDuration;
}

export function getAnimationsDuration(animationsArray){
  let animationsDuration = [];

  animationsArray.forEach(animationIndex => {
    const animateDuration = animationIndex.animate.getDuration();
    animationsDuration.push(animateDuration)   
  })  

  return animationsDuration; 
}

// Create array with each animate duration, for delays in timeline
export function getStarter(animationsArray){
  let starter = [0]; 

  animationsArray.map((animationIndex, index) => {
    let animateDuration = animationIndex.animate.getDuration();
    if(animateDuration ===  Infinity) animateDuration = 0; 

    starter = setStartOption(index, animationIndex, starter);
    
    const incrementDuration = animateDuration + [...starter].pop();
    starter.push(incrementDuration); 
  })
  
  return starter;
}

function setStartOption(index, options, starter){
  let start = options.start;
  if(start === undefined || start === '') return starter;
  
  // Start position relative
  if(typeof start === 'string'){
    start.trim();
    if(start.startsWith('<')){
      const countIndex = start.match(/</g || []).length;
      const value = parseInt(start.replace( /</g, '')) || 0;
      starter[index] = starter[index - countIndex] + value;       
    }else{
      starter[index] += parseInt(start);         
    }    
  }
  // Start position absolute
  else if(typeof start === 'number'){
    starter[index] = parseInt(start);
  }
    
  return starter;
}

export function getReverseStarter(animationsDuration, timelineDuration, starter, options){
  let reverseStarter = [];
  const animationsLength = animationsDuration.length;
  const timelineDelay = options.delay;
  const timelineEndDelay = options.endDelay;
  
  // if(timelineDuration === Infinity) timelineDuration = 4500;
  animationsDuration.map((animationIndex, index) => {
    if(animationIndex === Infinity) animationsDuration[index] = 0;
  });
  
  animationsDuration.forEach(( _, index) => {
    const start = timelineDuration - timelineDelay - timelineEndDelay - starter[animationsLength - (index + 1)] - animationsDuration[animationsLength - (index + 1)];
    reverseStarter.push(start);
  })

  return reverseStarter; 
}