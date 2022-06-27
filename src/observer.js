import { sleep } from './utils.js'

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

  // Markers
  if(markers) displayMarkers(optionsObserver, target);
  
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

async function displayMarkers(options, target){
  await sleep(100);
    
  const bodyRect = document.body.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const startOffset = targetRect.top - bodyRect.top - 16; 
  const endOffset = startOffset + targetRect.height;
  const rootMargin =  getRootMargin(options.rootMargin);
  const {marginTop, marginRight, marginBottom, marginLeft} = rootMargin;
  // const rootOffset = options.root ? (document.querySelector(options.root).clientHeight * offset) : window.innerHeight * offset;


  const start = document.createElement('div');
  start.innerText = 'start';
  start.style.cssText = `color: green; border-bottom: 1px solid green; text-align: right; width: 70px; position: absolute; top: ${startOffset}px; right: 10px;`
  document.body.appendChild(start); 

  const end = document.createElement('div');
  end.innerText = 'end';
  end.style.cssText = `color: red; border-bottom: 1px solid red; text-align: right; width: 70px; position: absolute; top: ${endOffset}px; right: 10px;`
  document.body.appendChild(end); 

  const root = document.createElement('div');
  root.innerText = 'root';
  root.style.cssText = `background-color: hsl(259, 90%, 54%, 0.1); position: fixed; inset: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft}; z-index: 1000; text-align: right; padding-right: 4px;`
  document.body.appendChild(root); 

}

function getRootMargin(rootMargin){
  let array = rootMargin.split(/\s+/);
  array = [...array].filter(el => el !== '');  
  array.forEach((el, index) => {
    if(el.startsWith('-')){
      array[index] = el.substring(1);
    }else{
      array[index] = `-${el}`;
    }
  })
  const obj = {
    marginTop: array[0],
    marginRight: array[1] || array[0],
    marginBottom: array[2] || array[0],
    marginLeft: array[3] || array[1] || array[0]
  }
  return obj;
}