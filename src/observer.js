import { sleep } from './utils.js'

export async function initObserver(options, animate){

  // Main options
  const mainOptions = {
    root: document.querySelector(options.root) || null,
    rootMargin: options.rootMargin || '0px',
    threshold: getThreshold(options.threshold) || 0
  }
  // Extra options
  let extraOptions = {
    target: document.querySelector(options.target) || animate.targets[0],
    targetMargin: options.targetMargin || '0px',
    toggleActions: getToggleActions(options.toggleActions) || getToggleActions('play none none none'),
    once: options.once || false,
    markers: options.markers || false,
    refreshInterval: options.refreshInterval === -1 ? -1 : false  || 1000,
  }

  // Triggers
  const triggers = {
    onEnter: options.onEnter || null,
    onLeave: options.onLeave || null,
    onEnterBack: options.onEnterBack || null,
    onLeaveBack: options.onLeaveBack || null,
    onRefresh: options.onRefresh || null
  }

  // Detect device type
  const isMobile = /Mobi/.test(navigator.userAgent);

  // Create target overlay
  extraOptions.target = await setTargetOverlay(extraOptions);

  // Markers
  let markers;
  if(extraOptions.markers) markers =  await displayMarkers(mainOptions, extraOptions.target);   

  // Refresh Options Display
  animate.options.observer = {
    target: extraOptions.target,
    root: mainOptions.root || document,
    rootMargin: mainOptions.rootMargin,
    threshold: mainOptions.threshold,
    toggleActions: extraOptions.toggleActions,
    once: extraOptions.once,
    markers: extraOptions.markers
  } 

  let observer = new IntersectionObserver((entries, observer) => handleIntersect(entries, observer, animate, extraOptions, triggers, markers), mainOptions);

  observer.observe(extraOptions.target);
  
  // Check resize
  let isRefreshing;
  if(!isMobile){  // disable on mobile
    const resizeListener = window.addEventListener('resize', () => {
      if(isRefreshing) return;
      isRefreshing = true;
      setTimeout(() => {
        isRefreshing = false;
        refresh();
      }, 2500);
    }, false);
  }
  
  // Check body height
  if(extraOptions.refreshInterval && extraOptions.refreshInterval > 0){
    if(isMobile) return; // disable on mobile
    let previousBodyHeight;
    setInterval(() => {
      const bodyHeight = document.body.getBoundingClientRect().height;
      if(bodyHeight !== previousBodyHeight) refresh();
      previousBodyHeight = bodyHeight;
    }, extraOptions.refreshInterval);
  }

  async function refresh(){  
    animate.options.observer.target.remove();
    observer.disconnect();  
    removeMarkers(markers);
    extraOptions.target = document.querySelector(options.target) || animate.targets[0];
    extraOptions.target = await setTargetOverlay(extraOptions);
    if(extraOptions.markers) markers = await displayMarkers(mainOptions, extraOptions.target);
    observer = new IntersectionObserver((entries, observer) => handleIntersect(entries, observer, animate, extraOptions, triggers, markers), mainOptions);
    observer.observe(extraOptions.target);
    if(triggers.onRefresh) triggers.onRefresh();
  }
}

// Detect threshold input type
function getThreshold(input){
  if(!input) return null;
  
  if(input <= 1) return input;

  if(input > 1) return buildThresholdList(parseInt(input));

  if(Array.isArray(input)) return input;
}

// Calcul threshold array
function buildThresholdList(numSteps) {
  let thresholds = [];

  for (let i=1; i<=numSteps; i++) {
    let ratio = i/numSteps;
    thresholds.push(ratio);
  }

  // thresholds.push(0);
  return thresholds;
}

// Display markers helper
async function displayMarkers(options, target){
  await sleep(200);    
  const bodyRect = document.body.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const startOffset = targetRect.top - bodyRect.top; 
  const endOffset = startOffset + targetRect.height;
  const rootMargin =  getComputedMargin(options.rootMargin);
  const {marginTop, marginRight, marginBottom, marginLeft} = rootMargin;
  const thresholds =  Array.isArray(options.threshold) ? options.threshold : [options.threshold];

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
  rootMarker.style.cssText = `color: black; border: 1px dashed gray; background-color: hsl(259, 90%, 54%, 0.03); position: fixed; inset: ${reverseNumber(marginTop)} ${reverseNumber(marginRight)} ${reverseNumber(marginBottom)} ${reverseNumber(marginLeft)}; z-index: 1000; text-align: right; padding-right: 4px; pointer-events: none;`
  document.body.appendChild(rootMarker); 

  let thresholdsMarkers = [];
  thresholds.forEach(threshold => {
    const thresholdMarker = document.createElement('div');
    const markerHeight = targetRect.height * threshold;
    thresholdMarker.style.cssText = `background-color: hsl(100, 90%, 54%, ${thresholds.length > 3 ? thresholds.length / 100 : '0.3'}); position: absolute; top: ${startOffset}px; right: 0; width: 20px; height: ${markerHeight}px; z-index: 999; pointer-events: none;`
    document.body.appendChild(thresholdMarker);
    thresholdsMarkers.push(thresholdMarker);
  });

  target.style.opacity = '0.4';
  target.style.backgroundColor = 'hsl(60, 54%, 80%)';

  return {startMarker, endMarker, rootMarker, target, thresholdsMarkers};
}

// Detect margin string and return computed value
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

// Transform % input to px value of target
function getSizeWithPercent(value, targetSize){
  if(!value.includes('%')) return value;
  return (Number(value.replace('%', '')) * targetSize) / 100 + 'px';
}

// Reverse +/- string
function reverseNumber(value){
  if(value.startsWith('-')){
    return value.substring(1);
  }else{
    return `-${value}`;
  }
}

// Create a target overlay
async function setTargetOverlay(extraOptions){   
  await sleep(200);
  const bodyRect = document.body.getBoundingClientRect();
  const targetRect = extraOptions.target.getBoundingClientRect();
  const startOffset = targetRect.top - bodyRect.top; 
  const {marginTop, marginRight, marginBottom, marginLeft} = getComputedMargin(extraOptions.targetMargin, targetRect);
  const targetOverlay = document.createElement('div');
  targetOverlay.innerText = 'target';
  targetOverlay.style.cssText = `width: calc(${targetRect.width}px + ${marginRight} + ${marginLeft}); height: calc(${targetRect.height}px + ${marginTop} + ${marginBottom}); position: absolute; top: calc(${startOffset}px - ${marginTop}); left: calc(${targetRect.left}px - ${marginLeft}); z-index: 1000; pointer-events: none; opacity: 0; text-align: right; padding-right: 4px;`;
  targetOverlay.id = extraOptions.target.id ? `${extraOptions.target.id}-observer-overlay`: `${extraOptions.target.className.split(" ")[0]}-observer-overlay`;
  document.body.appendChild(targetOverlay);
  return targetOverlay;
}

// Toggle actions
function getToggleActions(toggleActions){
  if(!toggleActions) return null;

  let array = toggleActions.split(/\s+/);
  array = [...array].filter(el => el !== '');  
  
  return {
    onEnter: getAction(array[0]),
    onLeave: getAction(array[1]),
    onEnterBack: getAction(array[2]),
    onLeaveBack: getAction(array[3])
  }  
}

// Return the right action for each toggleAction
function getAction(action){
  switch(action){
    case 'none':
      return '';
      break;
    case 'play':
      return 'play';
      break;
    case 'pause':
      return 'pause';
      break;
    case 'reverse':
      return 'reverse';
      break;
    case 'resume':
      return 'play';
      break;
    case 'finish':
      return 'finish';
      break;
    case 'restart':
      return 'restart';
      break;
    case 'reset':
      return 'reset';
      break; 
    default:
      return '';   
  }
}

// Handle Intersect
let prevRatio = 0;
function handleIntersect(entries, observer, animate, extraOptions, triggers, markers){
  entries.forEach(function(entry) {
    if(entry.intersectionRatio > prevRatio && entry.isIntersecting && entry.intersectionRect.top !== 0){
      if(extraOptions.toggleActions.onEnter) animate[extraOptions.toggleActions.onEnter]()
      if(triggers.onEnter) triggers.onEnter();
      if(extraOptions.once) animate.onFinish(() => removeMarkers(markers), observer.disconnect());
    }else if(entry.intersectionRatio < prevRatio && !entry.isIntersecting && entry.intersectionRect.top === 0){
      if(extraOptions.toggleActions.onLeave) animate[extraOptions.toggleActions.onLeave]()
      if(triggers.onLeave) triggers.onLeave();
    }else if (entry.intersectionRatio > prevRatio && entry.isIntersecting && entry.intersectionRect.top === 0){
      if(extraOptions.toggleActions.onEnterBack) animate[extraOptions.toggleActions.onEnterBack]()
      if(triggers.onEnterBack) triggers.onEnterBack();
    }else if(entry.intersectionRatio < prevRatio && !entry.isIntersecting && entry.intersectionRect.top !== 0){
      if(extraOptions.toggleActions.onLeaveBack) animate[extraOptions.toggleActions.onLeaveBack]()
      if(triggers.onLeaveBack) triggers.onLeaveBack();
    }
    prevRatio = entry.intersectionRatio;
  });
}

function removeMarkers(markers){
  if(!markers) return;
  markers.rootMarker.remove();
  markers.target.remove();
  markers.startMarker.remove();
  markers.endMarker.remove();
  markers.thresholdsMarkers.forEach(threshold => threshold.remove());
}