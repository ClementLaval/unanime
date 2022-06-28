import { getNumberOfAnimations } from "./utils.js";

export function onFinish(action, animationsArray){
  let count = 0;
  const numberOfAnimations = getNumberOfAnimations(animationsArray);
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.onfinish = () => {
        count++;
        if(count === numberOfAnimations) action();
      };
    });
  })
}

export function onReady(action, animationsArray){
  let count = 0;
  const numberOfAnimations = getNumberOfAnimations(animationsArray);
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.ready.then(() => {
        count++;
        if(count === numberOfAnimations && action) action();
      })
    });
  })
} 

export function onCancel(action, animationsArray){
  let count = 0;
  const numberOfAnimations = getNumberOfAnimations(animationsArray);
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.oncancel = () => {
        count++;
        if(count === numberOfAnimations) action();
      }
    });
  })
}

//TO DO 
export function onRemove(action, animationsArray){
  let count = 0;
  const numberOfAnimations = getNumberOfAnimations(animationsArray);
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.onremove = () => {
        count++;
        if(count === numberOfAnimations) action();
      }
    });
  })
}

export function onPlay(action, animate){
  animate.onPlayAction = action;
}

export function onPause(action, animate){
  animate.onPauseAction = action;
}

// TO DO déclenche une action à chaque nouveau tick d'iteration
export function onTick(action, animationsArray, trigger){

}

// TO DO déclenche une action lorsque l'animation atteind un certain pourcentage
export function onProgress(action, animationsArray, trigger){

}
