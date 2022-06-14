export function autoplay(status, animate){
  if(status === true){
    animate.play();
  }  
}

export function autocancel(status, animate){
  if(status === true){
    animate.onfinish(() => animate.cancel());    
  }
}

export function playbackRate(value = 1, animate){
  animate.setPlaybackRate(value);
}

export function willChange(status, animate){
  if(status === true){
    animate.onready(() => {
      animate.setWillChange(true, animate);
    });
  
    animate.onfinish(() => {
      animate.setWillChange(false, animate);
    });
  } 
} 

export function commitStyles(status, animate){
  if(status === true){
    animate.setCommitStyles(status);
  }
}

export function initStyles(status, animate){
  if(status === true){
    animate.setInitStyles(status);
  }
}

// TO DO setInitStyle (permet d'appliquer le style de la premiere ligne de l'animation en attendant son déclenchement)
// Iteration mode, enchainé chaque itération sur les animations individuelles / ou attendre la fin du groupe d'animations avant de relancer