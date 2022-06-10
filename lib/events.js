import { getNumberOfAnimations } from "./utils.js";

export function onfinish(action, animationsArray){
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

export function onready(action, animationsArray){
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

export function oncancel(action, animationsArray){
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
export function onremove(action, animationsArray){
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

export function onplay(action, animate){
  animate.onplayAction = action;
}

export function onpause(action, animate){
  animate.onpauseAction = action;
}

// TO DO déclenche une action à chaque nouveau tick d'iteration
export function ontick(action, animationsArray, trigger){

}

// TO DO déclenche une action lorsque l'animation atteind un certain pourcentage
export function onprogress(action, animationsArray, trigger){

}
