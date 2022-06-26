export function observer(options, animate){
  // Basic options
  const optionsObserver = {
    root: document.querySelector(options.root) || null,
    rootMargin: options.rootMargin || '0px',
    threshold: getThreshold(options.threshold) || 0
  }
  // Extra options
  const target = document.querySelector(options.target) || animate.targets[0];
  const once = options.once || false;
  const markers = options.markers || false;  
  
  // Refresh Options Display
  animate.options.observer = {
    target: target,
    root: optionsObserver.root || document,
    rootMargin: optionsObserver.rootMargin,
    threshold: optionsObserver.threshold,
    once: once,
    markers: markers
  } 

  observer = new IntersectionObserver(() => handleIntersect(animate), optionsObserver);

  observer.observe(target);
}

function getThreshold(input){
  if(!input) return null;
  
  if(input <= 1) return input;

  if(input > 1) return buildThresholdList(parseInt(input));

  if(Array.isArray(input)) return input;
}

function buildThresholdList(numSteps) {
  let thresholds = [];

  for (let i=1; i<=numSteps; i++) {
    let ratio = i/numSteps;
    thresholds.push(ratio);
  }

  // thresholds.push(0);
  return thresholds;
}

function handleIntersect(animate){
  animate.play();
}