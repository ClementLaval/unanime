export function easing(easing, index, targetsIndexLength){
  if(!easing){
    return 'linear';
  }else if(!Array.isArray(easing) && typeof easing === 'string'){
    return selectEasing(easing);
  }else if(Array.isArray(easing)){
    let current = easing[index];
    if(!current || current === null){
      for(let i=0; (!current || current === null); i++){
        current = easing[index - i];
      }
      return selectEasing(current);
    }
    return selectEasing(current);    
  } 
}

function selectEasing(easing){  
  if(easing.startsWith('cubic') || easing.startsWith('ease-')){
    return easing;
  }else {
    switch(easing){
      case 'easeInSine':
        return 'cubic-bezier(0.12, 0, 0.39, 0)';
        break;
      case 'easeOutSine':
        return 'cubic-bezier(0.61, 1, 0.88, 1)';
        break;
      case 'easeInOutSine':
        return 'cubic-bezier(0.37, 0, 0.63, 1)';
        break;
      case 'easeInCubic':
        return 'cubic-bezier(0.32, 0, 0.67, 0)';
        break;
      case 'easeOutCubic':
        return 'cubic-bezier(0.33, 1, 0.68, 1)';
        break;
      case 'easeInOutCubic':
        return 'cubic-bezier(0.65, 0, 0.35, 1)';
        break;
      case 'easeInQuint':
        return 'cubic-bezier(0.64, 0, 0.78, 0)';
        break;
      case 'easeOutQuint':
        return 'cubic-bezier(0.22, 1, 0.36, 1)';
        break;
      case 'easeInOutQuint':
        return 'cubic-bezier(0.83, 0, 0.17, 1)';
        break;
      case 'easeInCirc':
        return 'cubic-bezier(0.55, 0, 1, 0.45)';
        break;
      case 'easeOutCirc':
        return 'cubic-bezier(0, 0.55, 0.45, 1)';
        break;
      case 'easeInOutCirc':
        return 'cubic-bezier(0.85, 0, 0.15, 1)';
        break;
      case 'easeInQuad':
        return 'cubic-bezier(0.11, 0, 0.5, 0)';
        break;
      case 'easeOutQuad':
        return 'cubic-bezier(0.5, 1, 0.89, 1)';
        break;
      case 'easeInOutQuad':
        return 'cubic-bezier(0.45, 0, 0.55, 1)';
        break;        
      case 'easeInQuart':
        return 'cubic-bezier(0.5, 0, 0.75, 0)';
        break;
      case 'easeOutQuart':
        return 'cubic-bezier(0.25, 1, 0.5, 1)';
        break;
      case 'easeInOutQuart':
        return 'cubic-bezier(0.76, 0, 0.24, 1)';
        break;
      case 'easeInExpo':
        return 'cubic-bezier(0.7, 0, 0.84, 0)';
        break;
      case 'easeOutExpo':
        return 'cubic-bezier(0.16, 1, 0.3, 1)';
        break;
      case 'easeInOutExpo':
        return 'cubic-bezier(0.87, 0, 0.13, 1)';
        break; 
      case 'easeInBack':
      return 'cubic-bezier(0.36, 0, 0.66, -0.56)';
      break;
      case 'easeOutBack':
        return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
        break;
      case 'easeInOutBack':
        return 'cubic-bezier(0.68, -0.6, 0.32, 1.6)';
        break;
      default: return 'linear';
    }
  }
}

export function spring(stiffness, mass, damping){
  /* Spring Length, set to 1 for simplicity */
  let springLength = 1;

  /* Object position and velocity. */
  let x = -2;
  let v = 0;   

  /* Spring stiffness, in kg / s^2 */
  let k = -stiffness;

  /* Damping constant, in kg / s */
  let d = -damping;

  let frameRate = 60 / 1000;    
 
  let positions = []; 
  let i = 0; 

  while (x !== 1) {
    let Fspring = k * (x - springLength);
    let Fdamping = d * v;

    let a = (Fspring + Fdamping) / mass;
    v += a * frameRate;
    x += v * frameRate;

    i++;

    positions.push(x);
  }

  return positions;
}; 

export function lerp(a, b, p){
  return a + p * (b - a);
}