import { play, pause, reverse, setProgress } from './timelinePlayer';
import { setTimelineOptions } from './timelineOptions';
import { getAnimationsDuration, getTimelineDuration, getTotalTimelineDuration, getStarter, getReverseStarter } from './timelineHelpers';
import { initTimelineFeatures } from './initTimelineFeatures'; 


export function timeline(animationsArray = [], options = {}){
  const timeline = {
    animations: animationsArray,
    options: setTimelineOptions(options),
    details:{
      animationsDuration: [],
      starter: [],
      reverseStarter: [],
      timelineDuration: 0,
      totalTimelineDuration: 0,
      status: 'idle',
      progress: 0
    },
    play: () => play(animationsArray, timeline.details, timeline.options),
    reverse: () => reverse(animationsArray, timeline.details, timeline.options),
    pause: () => pause(animationsArray) 
  }

  // Computed properties

    // animations durations
    timeline.details.animationsDuration = getAnimationsDuration(animationsArray);

    // starter computed
    timeline.details.starter = getStarter(animationsArray);
    
    // timeline duration
    timeline.details.timelineDuration = getTimelineDuration(timeline.details.animationsDuration, timeline.details.starter, timeline.options);
    
    // total timeline duration
    timeline.details.totalTimelineDuration = getTotalTimelineDuration(timeline.details.timelineDuration, timeline.options);

    // reverse starter computed 
    timeline.details.reverseStarter = getReverseStarter(timeline.details.animationsDuration, timeline.details.timelineDuration, timeline.details.starter, timeline.options);

    // set progress
    // timeline.details.progress = setProgress(timeline);

    // Features
    initTimelineFeatures(timeline.options, timeline); 

  return timeline; 
} 

