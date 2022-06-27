import { sleep } from './utils.js'

export async function observer(options, animate){
  // Basic options
  const optionsObserver = {
    root: document.querySelector(options.root) || null,
    rootMargin: options.rootMargin || '0px',
    threshold: getThreshold(options.threshold) || 0
  }
  // Extra options
  let target = document.querySelector(options.target) || animate.targets[0];
  const targetMargin = options.targetMargin || '0px';
  const once = options.once || false;
  const markers = options.markers || false;  

  // Create target overlay
  target = await setTargetOverlay(target, targetMargin);

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

async function displayMarkers(options, target){
  await sleep(100);    
  const bodyRect = document.body.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const startOffset = targetRect.top - bodyRect.top; 
  const endOffset = startOffset + targetRect.height;
  const rootMargin =  getComputedMargin(options.rootMargin);
  const {marginTop, marginRight, marginBottom, marginLeft} = rootMargin;
  const thresholds =  Array.isArray(options.threshold) ? options.threshold : [options.threshold];
  // const rootOffset = options.root ? (document.querySelector(options.root).clientHeight * offset) : window.innerHeight * offset;

  const startMarker = document.createElement('div');
  startMarker.innerText = 'start';
  startMarker.style.cssText = `color: green; border-bottom: 1px solid green; text-align: right; width: 70px; position: absolute; top: ${startOffset - 16}px; right: 10px;`
  document.body.appendChild(startMarker); 

  const endMarker = document.createElement('div');
  endMarker.innerText = 'end';
  endMarker.style.cssText = `color: red; border-bottom: 1px solid red; text-align: right; width: 70px; position: absolute; top: ${endOffset - 16}px; right: 10px;`
  document.body.appendChild(endMarker); 

  const rootMarker = document.createElement('div');
  rootMarker.innerText = 'root';
  rootMarker.style.cssText = `color: black; border-bottom: 1px dashed gray; background-color: hsl(259, 90%, 54%, 0.03); position: fixed; inset: ${reverseNumber(marginTop)} ${reverseNumber(marginRight)} ${reverseNumber(marginBottom)} ${reverseNumber(marginLeft)}; z-index: 1000; text-align: right; padding-right: 4px; pointer-events: none;`
  document.body.appendChild(rootMarker); 

  thresholds.forEach(threshold => {
    const thresholdMarker = document.createElement('div');
    const markerHeight = targetRect.height * threshold;
    thresholdMarker.style.cssText = `background-color: hsl(100, 90%, 54%, ${thresholds.length > 3 ? thresholds.length / 100 : '0.3'}); position: absolute; top: ${startOffset}px; right: 0; width: 20px; height: ${markerHeight}px; z-index: 999; pointer-events: none;`
    document.body.appendChild(thresholdMarker);
  });

  target.style.opacity = '0.4';
  target.style.backgroundColor = 'hsl(60, 54%, 80%)';
}

function getComputedMargin(inputMargin, targetRect){
  let array = inputMargin.split(/\s+/);
  array = [...array].filter(el => el !== '');  
  let obj = {
    marginTop: array[0],
    marginRight: array[1] || array[0],
    marginBottom: array[2] || array[0],
    marginLeft: array[3] || array[1] || array[0]
  }
  // Transform from % to px of the target (targetOverlay only)
  if(targetRect){
    obj = {
      marginTop: getSizeWithPercent(obj.marginTop, targetRect.height),
      marginRight: getSizeWithPercent(obj.marginRight, targetRect.width),
      marginBottom: getSizeWithPercent(obj.marginBottom, targetRect.height),
      marginLeft: getSizeWithPercent(obj.marginLeft, targetRect.width)
    }
  }
  return obj;
}

function getSizeWithPercent(value, targetSize){
  if(!value.includes('%')) return value;
  return (Number(value.replace('%', '')) * targetSize) / 100 + 'px';
}

function reverseNumber(value){
  if(value.startsWith('-')){
    return value.substring(1);
  }else{
    return `-${value}`;
  }
}

async function setTargetOverlay(target, targetMargin){   
  await sleep(100);
  const bodyRect = document.body.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const startOffset = targetRect.top - bodyRect.top; 
  const {marginTop, marginRight, marginBottom, marginLeft} = getComputedMargin(targetMargin, targetRect);
  const targetOverlay = document.createElement('div');
  targetOverlay.innerText = 'target';
  targetOverlay.style.cssText = `width: calc(${targetRect.width}px + ${marginRight} + ${marginLeft}); height: calc(${targetRect.height}px + ${marginTop} + ${marginBottom}); position: absolute; top: calc(${startOffset}px - ${marginTop}); left: calc(${targetRect.left}px - ${marginLeft}); z-index: 1000; pointer-events: none; opacity: 0; text-align: right; padding-right: 4px;`;
  targetOverlay.id = target.id ? `${target.id}-observer-overlay`: `${target.className.split(" ")[0]}-observer-overlay`;
  document.body.appendChild(targetOverlay);
  return targetOverlay;
}

function handleIntersect(animate){
  animate.play();
}