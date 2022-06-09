export function setAnimation(keyframeEffects){

  const animation = new Animation(keyframeEffects, document.timeline);
 
  return animation;
}