export function setTargets(targets){
  const targetsArray = [];

  if(!Array.isArray(targets)){
    targetsArray.push(setByTargetType(targets));
  }
  else if(Array.isArray(targets)){
    targets.forEach(target => {
      targetsArray.push(setByTargetType(target))
    })
  }

  function setByTargetType(targets){   
    // One target string
    if(typeof targets === 'string'){
      return document.querySelectorAll(targets);
    }
    
    // One target object (QuerySelector)
    else if(typeof targets === 'object' && !Array.isArray(targets) && !targets.length){
      return new Array(targets);
    }
  
    // One target object Array (QuerySelectorAll)
    else if(typeof targets === 'object' && !Array.isArray(targets) && targets.length){
      return Array.prototype.slice.call(targets);
    }    
  }
   
  return targetsArray;
}

export function getTargets(animationsArray, mergeTargets){
  let targetsArray = [];

  if(animationsArray.length === 1){
    animationsArray[0].map(animation => {
      targetsArray.push(animation.effect.target);
    })

  }else{
    animationsArray.map(animationsIndex => {
      
      let targetsIndex = [];
      
      animationsIndex.forEach(animation => {
        targetsIndex.push(animation.effect.target);
      })
      
      targetsArray.push(targetsIndex);
    });
  }
  
  if(mergeTargets === true){
    targetsArray = [...targetsArray].flatMap((item) => item, [])
  }

  return targetsArray;
}



