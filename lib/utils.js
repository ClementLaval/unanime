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

export function retrieveAnimationIndex(index, animationsArray){
  let mainIndex, secondIndex;
  index++;
  
  if(index <= animationsArray[0].length){
    mainIndex = 0;
    secondIndex = index - 1;
    return {mainIndex, secondIndex}
  }
  
  else if(index > animationsArray[0].length){
    const arrayLength = Array.from(animationsArray.map(array => array.length));
    for(let i=0; i < arrayLength.length; i++){
      index -= arrayLength[i];
      if(index <= 0){
        mainIndex = i;
        secondIndex = index + arrayLength[i] - 1;
        return {mainIndex, secondIndex}
      }
    }
  }
}
