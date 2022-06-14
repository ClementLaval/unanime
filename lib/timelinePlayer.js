import { sleep, reversePlayback } from './utils.js';

export function play(animationsArray, details, options){
  playMode(animationsArray, details, options, 'play');
}

export function reverse(animationsArray, details, options){
  playMode(animationsArray, details, options, 'reverse');
}

async function playMode(animationsArray, details, options, playMode){
  const starter = details.starter;
  const reverseStarter = details.reverseStarter;
  const timelineDuration = details.timelineDuration;
  const timelineDelay = options.delay;
  const timelineEndDelay = options.endDelay;
  const timelineDirection = options.direction;
  let timelineIterations = options.iterations;

  // NORMAL
  if(
    (playMode === 'play' && timelineDirection === 'normal') ||
    (playMode === 'reverse' && timelineDirection === 'reverse')
  ){
    for(let i=0; i < timelineIterations; i++){ // iterations
      playNormal(animationsArray, starter, timelineDelay);
      await sleep(timelineDuration); // wait before new tick
    }
  }
  // REVERSE
  else if(
    (playMode === 'play' && timelineDirection === 'reverse') ||
    (playMode === 'reverse' && timelineDirection === 'normal')
    ){
      
    // Reverse animation
    animationsArray = [...animationsArray].reverse();
    animationsArray = reversePlayback(animationsArray);
    
    for(let i=0; i < timelineIterations; i++){ // iterations
      playReverse(animationsArray, reverseStarter, timelineEndDelay); 
      await sleep(timelineDuration); // wait before new tick
    } 
    
    // Reset reverse
    animationsArray = reversePlayback(animationsArray);
    animationsArray = [...animationsArray].reverse();
  }
  // ALTERNATE
  else if(
    (playMode === 'play' && timelineDirection === 'alternate') ||
    (playMode === 'reverse' && timelineDirection === 'alternate')
  ){
    // First play normal
    if(playMode === 'play'){
      playNormal(animationsArray, starter, timelineDelay);
      await sleep(timelineDuration); // wait before new tick
    }
    else if(playMode === 'reverse'){
      animationsArray = [...animationsArray].reverse();
      playAlternate(animationsArray, reverseStarter, timelineEndDelay);
      await sleep(timelineDuration); // wait before new tick

      timelineIterations = timelineIterations - 1; // i loop start at 0
    }
     
    for(let i=playMode === 'reverse' ? 0 : 1; i < timelineIterations; i++){ // sync with right modulo
      // Toggle animation direction
      animationsArray = [...animationsArray].reverse();
      if(i%2 == 0){
        playAlternate(animationsArray, starter, timelineDelay);
        await sleep(timelineDuration); // wait before new tick 
      }else{ 
        playAlternate(animationsArray, reverseStarter, timelineEndDelay);
        await sleep(timelineDuration); // wait before new tick      
      }     
    }     
  }
}

function playNormal(animationsArray, starter, timelineDelay){
  setTimeout(() => {
    animationsArray.map((animationIndex, index) => {
      setTimeout(() => {
        animationIndex.animate.play();        
      }, starter[index]); // starter
    });        
  }, timelineDelay); // timelineDelay    
}


function playReverse(animationsArray, reverseStarter, timelineEndDelay){    
  setTimeout(() => {
    animationsArray.map((animationIndex, index) => {
      setTimeout(() => {
        animationIndex.animate.play();
      }, reverseStarter[index]); // starter
    });        
  }, timelineEndDelay); // timelineDelay  
}

function playAlternate(animationsArray, toggleStarter, toggleDelay){
  setTimeout(() => {
    animationsArray.map((animationIndex, index) => {
      setTimeout(() => {
        animationIndex.animate.reverse(); // use reverse instead of reversePlaybackRate, can cause clipping with 'alternate'      
      }, toggleStarter[index]); // starter
    });        
  }, toggleDelay);
}

export function pause(animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.animate.pause();
  })  
} 


export function setProgress(timeline){
  let playerStatus = timeline.details.status;
  let progress = 0;

  const play = () => setInterval(() => {
    if(playerStatus === 'play'){
      progress = progress + 1000;
      timeline.details.progress = progress;
    }
    console.log(playerStatus);
  }, 1000);
  
  return progress;
}
