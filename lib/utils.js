export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getNumberOfAnimations(animationsArray){
  let count = 0;
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      count++;
    });
  })

  return count;
}

export function reverseNumber(value){
  if(value > 0){
    return -Math.abs(value);
  }else{
    return Math.abs(value);    
  }
}

export function reversePlayback(animationsArray){
  animationsArray.map(animationIndex => {    
    const playbackRate = animationIndex.animate.getPlaybackRate();       
    animationIndex.animate.setPlaybackRate(reverseNumber(playbackRate)); 
  }) 

  return animationsArray;
}
