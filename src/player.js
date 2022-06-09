// console.log(animation.effect.getTiming());
// animation.effect.updateTiming({duration: 5000});

export function play(animationsArray, onplayAction){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.play();
    });
  })
  if(onplayAction) onplayAction(); 
}

export function pause(animationsArray, onpauseAction){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.pause();
    });
  })  
  if(onpauseAction) onpauseAction(); 
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

