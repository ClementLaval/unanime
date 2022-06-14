import { refreshOptionsDisplay } from "./options.js";

export function setPlaybackRate(value = 1, animationsArray, animate){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.updatePlaybackRate(value);
    });
  })
  refreshOptionsDisplay('playbackRate', value, animate);
}

export function setWillChange(status = false, animationsArray, animate){
  if(status === true){
    animationsArray.map(animationIndex => {
      animationIndex.forEach(animation => {
        const target = animation.effect.target;
        target.style.willChange = 'transform';
      });
    })  
    refreshOptionsDisplay('willChange', status, animate);
  }
  else if (status === false){
    animationsArray.map(animationIndex => {
      animationIndex.forEach(animation => {
        const target = animation.effect.target;
        target.style.removeProperty('will-change');
      });
    })  
    refreshOptionsDisplay('willChange', status, animate);
  }
}

export function setDirection(value = 'normal', animationsArray, animate){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.effect.updateTiming({direction: value});
    })
  })
  refreshOptionsDisplay('direction', value, animate);
}

export function setCommitStyles(status = false, animationsArray, animate){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      animation.commitStyles();
    })
  })
  refreshOptionsDisplay('commitStyles', status, animate); 
}

export function setInitStyles(status = false, animationsArray, animate){
  animationsArray.map(animationIndex => {
    animationIndex.forEach(animation => {
      const stylesLength = JSON.stringify(animate.keyframes[0]).length;
      let styles = JSON.stringify(animate.keyframes[0]).substring(1, stylesLength - 1);
      styles = styles.replace(/['"]+/g, '');
      const target = animation.effect.target;
      target.style.cssText = styles; 
    })
  })
  refreshOptionsDisplay('initStyles', status, animate); 
}