import { setTargets } from "./targets";
import { setKeyframes } from './keyframes';
import { setOptions, getOptionsDisplay } from './options';
import { setKeyframeEffect } from './keyframeEffect';
import { setAnimation } from './animation';

export function initAnimations(targets, keyframes, options){

  let animationsArray = []; 
  let optionsComputed= {};

  // Create array with all targets
  targets = setTargets(targets); //Array of arrays (querySelectorAll)

  // Foreach target, create own keyframeEffect and animation
  targets.map(targetsIndex => {
    let arr = [];

    targetsIndex.forEach((target, index, targetsIndex) => {

      const targetIndexLength = targetsIndex.length;
     
      const funcKeyframes = setKeyframes(keyframes);
      
      const funcOptions = setOptions(options, index, targetIndexLength); 

      optionsComputed = {...funcOptions}; 
      
      const keyframeEffect = setKeyframeEffect(target, funcKeyframes, funcOptions); 

      const animation = setAnimation(keyframeEffect); 

      arr.push(animation);

    });
    
    animationsArray.push(arr);
  })

  return { animationsArray, optionsComputed };
}
