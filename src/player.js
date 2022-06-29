export function play(animationsArray, onPlayAction){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.play();
    });
  })
  if(onPlayAction) onPlayAction(); 
}

export function pause(animationsArray, onPauseAction){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.pause();
    });
  })  
  if(onPauseAction) onPauseAction(); 
}

export function restart(animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.pause();
      animation.currentTime = 0;      
      animation.play(); 
    });
  })
}

export function cancel(animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.cancel();
    });
  })
}

export function reset(animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.currentTime = 0;      
      animation.pause();
    });
  })
}

export function finish(animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.finish();
    });
  })
}

export function reverse(animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.reverse();
    });
  })
}

export function seek(value = 0, animationsArray){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      const {delay, duration, iterations, endDelay} = animation.effect.getTiming();
      const totalTime = delay + (duration * iterations) + endDelay;
      let seek = (value * totalTime);
      animation.currentTime = seek;    
    });
  })
}

export function scrub(value, animationsArray){
  console.log(value);
}
