export function stagger(input, index, targetIndexLength){
  const init = input.default || 0;
  const stagger = input.stagger || 0;
  const from = input.from || 'start'; // 'start, 'center', 'end'
  const direction = input.direction || 'normal'; // 'normal', 'reverse'
  
  if((from === 'start' && direction === 'normal') || (from === 'end' && direction === 'reverse')){
    return init + (stagger * index); 
  }
  else if((from === 'end' && direction === 'normal') || (from === 'start' && direction === 'reverse')){
    return init + (stagger * (targetIndexLength - index));
  }
  else if(from === 'center' && direction === 'normal'){
    const arrayCenter = (targetIndexLength - 1) / 2;
    const gap = arrayCenter - index;
    return init + (stagger * Math.abs(gap));
  }
  else if(from === 'center' && direction === 'reverse'){
    let gap = [];
    [1, targetIndexLength].map(fromIndex => {
      gap.push(Math.abs(fromIndex - (index + 1)));
    })
    gap = Math.min(...gap);
    return init + (stagger * Math.abs(gap));
  } 
  else if(typeof from === 'number' && direction === 'normal'){
    const gap = from - (index + 1);
    return init + (stagger * Math.abs(gap));
  }
  else if(typeof from === 'number' && direction === 'reverse'){  
    const max = (targetIndexLength - 1) - from;
    const ratio = (index + 1) - from;
    const reverse = max - Math.abs(ratio);
    return init + (stagger * reverse);
  }
  else if(Array.isArray(from) && direction === 'normal'){
    let gap = [];
    from.map(fromIndex => {
      gap.push(Math.abs(fromIndex - (index + 1)));
    })
    gap = Math.min(...gap);
    return init + (stagger * Math.abs(gap));
  } 
  else if(Array.isArray(from) && direction === 'reverse'){
    let max = [];
    from.map(fromIndex => {
      max.push((targetIndexLength) - fromIndex);
    })
    max = Math.min(...max);

    let ratio = [];
    from.map(fromIndex => {
      ratio.push(Math.abs(fromIndex - (index + 1)));
    })
    ratio = Math.min(...ratio);
    
    const reverse = max - Math.abs(ratio);    
    
    return init + (stagger * reverse);
  } 
}