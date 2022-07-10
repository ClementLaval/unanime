import { sleep } from './utils.js'

export async function initObserver(options, animate){

  // Main options
  const mainOptions = {
    root: document.querySelector(options.root) || null,
    rootMargin: options.rootMargin || '0px',
    threshold: options?.pin === true && !options.threshold ? getThreshold(100) :  getThreshold(options.threshold) || 0
  }
  
  // Extra options
  let extraOptions = {
    target: getTarget(document.querySelectorAll(options.target)) || getTarget(animate.targets),
    targetRaw: getTarget(document.querySelectorAll(options.target)) || getTarget(animate.targets),
    targetMargin: options.targetMargin || '0px',
    toggleActions: getToggleActions(options.toggleActions) || getToggleActions('play none none none'),
    once: options.once || false,
    split: options.split || false,
    markers: options.markers || false,
    overlay: options.overlay || false,
    refreshInterval: options.refreshInterval || -1,
    pin: options.pin || false,
    pinOptions: {
      smoothness: options.pinOptions?.smoothness || 0.05,
      delay: options.pinOptions?.delay || 0
    } 
  }
 
  // triggerActions
  const triggerActions = {
    onEnter: options.onEnter || null,
    onLeave: options.onLeave || null,
    onEnterBack: options.onEnterBack || null,
    onLeaveBack: options.onLeaveBack || null,
    onRefresh: options.onRefresh || null
  }

  // Detect device type
  const isMobile = /Mobi/.test(navigator.userAgent);

  // Create target overlay 
  let targetsList 
  if(extraOptions.overlay === true){
    targetsList = []; 
    await Promise.all(extraOptions.target.map(async(target) => {
      targetsList.push(await setTargetOverlay(target, extraOptions.targetMargin));
    })) 
    extraOptions.target = targetsList;
  }
  
  // Markers
  let markersList; 
  if(extraOptions.markers === true){
    markersList = [];
    await Promise.all(extraOptions.target.map(async(target) => {
      markersList.push(await displayMarkers(mainOptions, target));
    })) 
  } 
  
  // Refresh Options Display
  animate.options.observer = {
    target: extraOptions.target,
    targetRaw: extraOptions.targetRaw,
    targetMargin: extraOptions.targetMargin,
    root: mainOptions.root || document,
    rootMargin: mainOptions.rootMargin,
    threshold: mainOptions.threshold,
    toggleActions: extraOptions.toggleActions,
    once: extraOptions.once,
    split: extraOptions.split,
    markers: extraOptions.markers,
    overlay: extraOptions.overlay,
    pin: extraOptions.pin,
    pinOptions: extraOptions.pinOptions,
    markersList: markersList,
    refreshInterval: extraOptions.refreshInterval,
    triggerActions: triggerActions
  } 

  // Create Observer List
  let observersList = [];
  extraOptions.target.map(( _, obsIndex) => {
    observersList.push(new IntersectionObserver((entries, observer) => handleIntersect(entries, observer, animate, obsIndex), mainOptions));
  })
  
  observersList.forEach((observer, index) => {
    observer.observe(extraOptions.target[index]);
  })

  // Refresh Options Display
  animate.options.observer.observersList = observersList;
  if(animate.options.observer.once === true){
    animate.options.observer.onceStatus  = Array.from(observersList.map(status => 'pending'));
  }


  // Check resize
  let isRefreshing;
  if(!isMobile){  // disable on mobile
    const resizeListener = window.addEventListener('resize', () => {
      if(isRefreshing) return;
      isRefreshing = true;
      setTimeout(() => {
        isRefreshing = false;
        animate.refreshObserver();
      }, 500);
    }, false);
  }
  
  // Check body height
  if(extraOptions.refreshInterval && extraOptions.refreshInterval > 0){
    if(isMobile) return; // disable on mobile
    let previousBodyHeight;
    setInterval(() => {
      const bodyHeight = document.body.getBoundingClientRect().height;
      if(bodyHeight !== previousBodyHeight) animate.refreshObserver();
      previousBodyHeight = bodyHeight;
    }, extraOptions.refreshInterval);
  }  
}

// Refresh
export async function refresh(delay, animate){
  const Observer = animate.options.observer;

  // isDoneArray: return true if animation's once status is already 'done'
  let isDoneArray;
  if(Observer.once === true){
    // Build once status array
    isDoneArray = Array.from(Observer.onceStatus.map(status => status === 'done' ? true : false));
    if(!isDoneArray.includes(false)) return;

    Observer.target = Observer.target.map((target, index) => isDoneArray[index] === true ? null : target);

    Observer.observersList = Observer.observersList.map((observer, index) => isDoneArray[index] === true ? null : observer);
  }
  
  // delay
  if(delay) await sleep(delay);

  // remove overlays
  if(Observer.overlay === true){  
    Observer.target.map(target => target && target.remove());
  }
  
  // disconnect observers
  Observer.observersList.map(observer => observer && observer.disconnect());  

  // remove markers
  if(Observer.markers === true){
    removeMarkers(Observer.markersList, Observer.overlay);      
  }

  // reset target
  if(Observer.once === true){
    Observer.target = Observer.targetRaw.map((target, index) => isDoneArray[index] === true ? null : target);
  }else{
    Observer.target = Observer.targetRaw;
  }

  // rebuild overlays
  if(Observer.overlay === true){    
    let targetsList = [];

    await Promise.all(Observer.target.map(async(target) => {
      if(target){
        targetsList.push(await setTargetOverlay(target, Observer.targetMargin));
      }else{
        targetsList.push(null);
      }
    }))    
    Observer.target = targetsList;
  }

  // Rebuild markers
  if(Observer.markers === true){
    let markersList = [];      
    await Promise.all(Observer.target.map(async(target) => {
      if(target){
        markersList.push(await displayMarkers(Observer, target));
      }else{
        markersList.push(null);
      }
    }))     
    Observer.markersList = markersList;
  }

  // Restart listerner observer
  Observer.observersList.forEach((observer,index) => {
    if(observer !== null)
    observer.observe(Observer.target[index])
  })

  // Custom action
  if(Observer.triggerActions.onRefresh) Observer.triggerActions.onRefresh();
}

// Return targets and destructure arrays
function getTarget(target){
  target = [...target];
  if(!target || target.length === 0) return null;
  let targetsList = [];
  for(const el of target){
    if(Array.isArray(el)){     
      el.map(item => targetsList.push(item));      
    }else{
      targetsList.push(el)
    }
  }
  return targetsList;
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
  return thresholds;}

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
async function setTargetOverlay(target, targetMargin){   
  await sleep(200);
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
    case 'complete':
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
let firstTick = true;
function handleIntersect(entries, observer, animate, obsIndex){
  const Observer = animate.options.observer;
  obsIndex = Observer.split === true ? obsIndex : null; //toggle split mode
  entries.map((entry) => {
    let isEntering, isLeaving, isBelow;
    entry.intersectionRatio > prevRatio ? (isEntering = true, isLeaving = false) : (isEntering = false, isLeaving = true);
    entry.boundingClientRect.top > entry.rootBounds.top ? isBelow = true : isBelow = false;

    if(firstTick) return firstTick = false; // bypass first tick (load tick)
  
    if(isEntering && isBelow){
      if(Observer.triggerActions.onEnter) Observer.triggerActions.onEnter(entry);
      if(Observer.pin){animate.scrub(entry.intersectionRatio, Observer.pinOptions)}
      else{(Observer.toggleActions.onEnter) && animate[Observer.toggleActions.onEnter](obsIndex)}
      if(Observer.once && !Observer.pin) animate.onFinish(function(){removeMarkers(Observer.markersList, Observer.overlay, obsIndex); disconnectObserver(obsIndex, Observer.observersList); Observer.onceStatus = updateOnceStatus(obsIndex, Observer.onceStatus)}, obsIndex);
      if(Observer.once && Observer.pin) entry.intersectionRatio > 0.95 && function(){removeMarkers(Observer.markersList, Observer.overlay, obsIndex); disconnectObserver(obsIndex, Observer.observersList); Observer.onceStatus = updateOnceStatus(obsIndex, Observer.onceStatus)}();
    }
    else if(isLeaving && !isBelow){
      if(Observer.triggerActions.onLeave) Observer.triggerActions.onLeave(entry);
      if(Observer.pin){return; animate.scrub(1 - entry.intersectionRatio)}
      else{(Observer.toggleActions.onLeave) && animate[Observer.toggleActions.onLeave](obsIndex)}
    }
    else if(isEntering && !isBelow){
      if(Observer.triggerActions.onEnterBack) Observer.triggerActions.onEnterBack(entry);
      if(Observer.pin){return; animate.scrub(1 - entry.intersectionRatio)}
      else{(Observer.toggleActions.onEnterBack) && animate[Observer.toggleActions.onEnterBack](obsIndex)}
    }
    else if(isLeaving && isBelow){
      if(Observer.triggerActions.onLeaveBack) Observer.triggerActions.onLeaveBack(entry);
      if(Observer.pin){animate.scrub(entry.intersectionRatio, Observer.pinOptions)}
      else{(Observer.toggleActions.onLeaveBack) && animate[Observer.toggleActions.onLeaveBack](obsIndex)}
    }
    prevRatio = entry.intersectionRatio;
  });
}

// Remove markers
function removeMarkers(markersList, overlay, obsIndex){
  if(!markersList) return;
  if(typeof obsIndex === 'number') markersList = [[...markersList][obsIndex]];
  markersList.map(markers => {
    if(!markers) return;
    markers.rootMarker.remove();
    markers.startMarker.remove();
    markers.endMarker.remove();
    markers.thresholdsMarkers.forEach(threshold => threshold.remove());
    if(overlay === true){
      markers.target.remove();
    }else{
      markers.target.style.opacity = '1';
      markers.target.style.backgroundColor = 'inherit';
    }
  });
}

function disconnectObserver(obsIndex, observersList){
  if(obsIndex !== null){
    return observersList[obsIndex].disconnect();
  }
  observersList.map(observer => observer.disconnect());
}

function updateOnceStatus(obsIndex, onceStatus){
  if(obsIndex !== null){
    return onceStatus.map((status, index) => index === obsIndex ? 'done' : status);
  }  
  return onceStatus.map(status => 'done');
}