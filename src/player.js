import { retrieveAnimationIndex } from "./utils.js"

export function play(index, animationsArray, onPlayAction){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    return animationsArray[mainIndex][secondIndex].play();
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {      
      animation.play();  
    });
  })
  if(onPlayAction) onPlayAction(); 
}

export function pause(index, animationsArray, onPauseAction){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    return animationsArray[mainIndex][secondIndex].pause();
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.pause();
    });
  })  
  if(onPauseAction) onPauseAction(); 
}

export function restart(index, animationsArray){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    animationsArray[mainIndex][secondIndex].pause();
    animationsArray[mainIndex][secondIndex].playbackRate = Math.abs(animationsArray[mainIndex][secondIndex].playbackRate);  
    animationsArray[mainIndex][secondIndex].currentTime = 0;
    animationsArray[mainIndex][secondIndex].play();
    return;
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.pause();
      animation.playbackRate = Math.abs(animation.playbackRate);    
      animation.currentTime = 0;      
      animation.play(); 
    });
  })
}

export function cancel(index, animationsArray){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    return animationsArray[mainIndex][secondIndex].cancel()
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.cancel();
    });
  })
}

export function reset(index, animationsArray){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    animationsArray[mainIndex][secondIndex].playbackRate = Math.abs(animationsArray[mainIndex][secondIndex].playbackRate);  
    animationsArray[mainIndex][secondIndex].currentTime = 0;
    animationsArray[mainIndex][secondIndex].pause();
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.playbackRate = Math.abs(animation.playbackRate);    
      animation.currentTime = 0;  
      animation.pause();
    });
  })
}

export function finish(index, animationsArray){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    return animationsArray[mainIndex][secondIndex].finish();
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.finish();
    });
  })
}

export function reverse(index, animationsArray){
  if(typeof index === 'number'){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    return animationsArray[mainIndex][secondIndex].reverse();
  } 
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.reverse();
    });
  })
}

export function seek(value = 0, index = null, animationsArray){
  
  if(index !== null){
    const {mainIndex, secondIndex} =  retrieveAnimationIndex(index, animationsArray);
    const {delay, duration, iterations, endDelay} = animationsArray[mainIndex][secondIndex].effect.getTiming();
    const totalTime = delay + (duration * iterations) + endDelay;
    let seek = (value * totalTime);
    return animationsArray[mainIndex][secondIndex].currentTime = seek;      
  }
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      const {delay, duration, iterations, endDelay} = animation.effect.getTiming();
      const totalTime = delay + (duration * iterations) + endDelay;
      let seek = (value * totalTime);
      animation.currentTime = seek;    
    });
  })
}

export function scrub(pinOptions, index, animate){
  const {smoothness, delay} = pinOptions || {smoothness: 0.05, delay: 0};  
  // init scrub states
  if(index !== null){
    const targetsLength = animate.targets.reduce((prev, current) => prev.length + current.length);
    animate.scrubStates = Array(targetsLength).fill().map(states => states = {
      position: 0,
      target: 0,
      isPlaying: false
    })
  }else{
    animate.scrubStates = [{
      position: 0,
      target: 0,
      isPlaying: false
    }]
  }
  
  animate.useScrub = (value, index) => {
    
    const seekIndex = index !== null ? index : null; // return null to seek all targets
    index = index !== null ? index : 0;

    if(delay){
      setTimeout(() => { animate.scrubStates[index].target = value }, delay);
    }else{
      animate.scrubStates[index].target = value;
    }
    
    const limit = value > animate.scrubStates[index].position ? value - 0.001 : value + 0.001;  
    
    function loop(){
      const limitCondition = value > animate.scrubStates[index].position ? animate.scrubStates[index].position > limit : animate.scrubStates[index].position < limit;
      if(limitCondition) return animate.scrubStates[index].isPlaying = false && window.cancelAnimationFrame();
      if(animate.scrubStates[index].isPlaying === true){
        animate.scrubStates[index].position += (animate.scrubStates[index].target - animate.scrubStates[index].position) * smoothness;
        animate.seek(animate.scrubStates[index].position, seekIndex);
        requestAnimationFrame(loop);  
      }
    }
    if(animate.scrubStates[index].isPlaying) return;
    requestAnimationFrame(loop); 
    animate.scrubStates[index].isPlaying = true;
  }  
}