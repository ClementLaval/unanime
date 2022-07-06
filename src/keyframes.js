export function setKeyframes(keyframes, options){
  
  if(options.easing && typeof options.easing === 'object'){
    return getKeyframesProperties(keyframes)
  } else{
    return keyframes;
  }
}

function getKeyframesProperties(keyframes){
  // Obj keys, css class name
  let firstFrameProperties = [];
  let lastFrameProperties = [];

  // String properties values without numbers
  let firstFrameContent = [];
  let lastFrameContent = [];

  // Values
  let firstFrameValues = [];
  let lastFrameValues = [];
  
  // Split key / values firstFrame
  for (const [key, value] of Object.entries(keyframes[0])) {    
    firstFrameProperties.push(key);
    firstFrameContent.push(removeNumbers(value));
    firstFrameValues.push(extractNumbers(value));
  }
  
  // Split key / values lastFrame
  for (const [key, value] of Object.entries(keyframes[1])) {    
    lastFrameProperties.push(key);
    lastFrameContent.push(removeNumbers(value));
    lastFrameValues.push(extractNumbers(value));
  }

  const stepsValues = getStepsValues(firstFrameValues, lastFrameValues);

  const newKeyframes = fillKeyframes(firstFrameProperties, firstFrameContent, stepsValues);
  
  return newKeyframes;
}

// Extract numbers from string and return array of number
function extractNumbers(value){
  if(typeof value === 'number') return [value];
  const regexp = /[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)/g;
  let numbers = value.match(regexp);
  numbers = [...numbers].map(number => Number(number));
  return numbers;
}

// Remove numbers / replaced by '$' and return string
function removeNumbers(value){
  if(typeof value === 'number') return '$';
  const regexp = /[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)/g;
  const string = value.replace(regexp, '$');
  return string;
}

// Calcul each steps from 0% to 100%
function getStepsValues(firstFrameValues, lastFrameValues){
  let valuesArray = [];
  // Number of differente css properties
  firstFrameValues.map((property, index) => {
    let propertyArray = [];
    property.forEach((_, idx) => {
      const firstValue = firstFrameValues[index][idx];
      const lastValue = lastFrameValues[index][idx];
      let localArray = [];

      for(let i=0; i < 100; i++){
        let t = i / 100;
        let p = spring(t);
        
        localArray.push(lerp(firstValue, lastValue, p)); 
      }         
      propertyArray.push(localArray);
    })
    valuesArray.push(propertyArray);
  });

  return valuesArray;
}

function spring(t){
  const tension = 6;
  return -0.5 * (2.71828 ** (-6 * t)) * (-2 * (2.71828 ** (6 * t)) + Math.sin(6 * t) + 6 * Math.cos(tension* t));     
}

function lerp(a, b, p){
  return a + p * (b - a);
}

// Rebuild keyframes with computed values
function fillKeyframes(properties, contents, stepsValues){
  let keyframesArray = [];

  const contentsWithoutDollar = [];
  const dollarPosition = [];

  // Extract $ placeholder and get position
  contents.map(content => {
    let localPosition = [];
    let position;
    while(position !== -1){
      position = content.indexOf('$');
      localPosition.push(position);
      content = position !== -1 ? content.slice(0, position) + content.slice(position + 1) : content;
    }
    localPosition.pop();
    dollarPosition.push(localPosition);
    contentsWithoutDollar.push(content);
  })
  
  for(let i=0; i < 100; i++){
    const keyframe = {};
    properties.forEach((property, index) => {
      let tempKeyframe;
      let offset = 0;
      dollarPosition[index].map((position, idx) => {
        if(!tempKeyframe){
          tempKeyframe = contentsWithoutDollar[index].substring(0, position) + stepsValues[index][idx][i] +  contentsWithoutDollar[index].substring(position);
        }else{
          tempKeyframe = tempKeyframe.substring(0, position + offset) + stepsValues[index][idx][i] +  tempKeyframe.substring(position + offset);
        }
        offset += stepsValues[index][idx][i].toString().length;
      })
      keyframe[property] = tempKeyframe;
    })              
    keyframesArray.push(keyframe);    
  }

  return keyframesArray; 
}