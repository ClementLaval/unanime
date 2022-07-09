import { retrieveAnimationIndex } from "./utils.js"

export function play(index, animationsArray, onPlayAction){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    return animationsArray[mainIndex][secondIndex].play()
  } 
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
      animation.playbackRate = Math.abs(animation.playbackRate);    
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
      animation.playbackRate = Math.abs(animation.playbackRate);    
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

export function scrub(pinOptions, animate){
  const {smoothness, delay} = pinOptions || {smoothness: 0.05, delay: 0};   

  animate.states = {
    position: 0,
    target: 0,
    isPlaying: false
  }
  
  animate.useScrub = (value) => {
    
    if(delay){
      setTimeout(() => { animate.states.target = value }, delay);
    }else{
      animate.states.target = value;
    }
    
    const limit = value > animate.states.position ? value - 0.001 : value + 0.001;  
    
    function loop(){
      const limitCondition = value > animate.states.position ? animate.states.position > limit : animate.states.position < limit;
      if(limitCondition) return animate.states.isPlaying = false && window.cancelAnimationFrame();
      if(animate.states.isPlaying === true){
        animate.states.position += (animate.states.target - animate.states.position) * smoothness;
        animate.seek(animate.states.position);
        requestAnimationFrame(loop);  
      }
    }
    if(animate.states.isPlaying) return;
    requestAnimationFrame(loop); 
    animate.states.isPlaying = true;
  }  
}