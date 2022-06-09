export function getDuration(animationsArray){
  let totalDuration = 0;

  animationsArray.map(animationIndex => {
    let indexDuration = 0;

    animationIndex.forEach(animation => {  
      const {delay, duration, endDelay, iterations} = animation.effect.getTiming();
      const playbackRate = Math.abs(animation.playbackRate);
      const animationDuration = delay + (duration * iterations) + endDelay;
      const localDuration = animationDuration / playbackRate;      
      if(indexDuration < localDuration) indexDuration = localDuration;      
    });
      if(totalDuration < indexDuration) totalDuration = indexDuration;    
  })

  return totalDuration;
}

export function getPlayState(animationsArray){
  let playState = null;

  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      playState = animation.playState;
    })
  })

  return playState;
}

export function getCurrentIteration(animationsArray){
  let currentIteration = null;

  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      currentIteration = animation.effect.getComputedTiming().currentIteration;
    })
  })

  return currentIteration;
}

export function getPlaybackRate(animate){
  let playbackRate = animate.options.playbackRate;
  
  return playbackRate;
}

// TO DO
export function getProgress(animationsArray){
  let progress = null;
  
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      progress = animation.effect.getComputedTiming().progress;
      console.log(progress);
    })
  })

  return progress;
}