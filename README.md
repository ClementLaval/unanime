# <center>unanime.js</center>

***<center>Javascript animation library build on top of web animation API (WAAPI).</center>***


# Getting started

## Download

```
$ npm install unanime --save
````

## Import

### ES6 modules

```JS
import { animate } from 'unanime';
```

### Common js

```JS
require animate = require('unanime');
````

# Quick start

## Example
```JS
import { animate } from 'unanime';

const myAnimation = animate(
  '.targets', 
  [
    {transform: translateX('100px')}
  ],
  {
    duration: 1500,
    direction: 'alternate',
    iterations: 3, 
    autoplay: true
  }
)
```

## Structure
```JS
cont var = animate(
  // Targets,
  [
    // Keyframes
  ],
  { 
    // Options
  }
)
```

## Targets
String / Object or Array accepted.

```JS
// Targets
'.myTargets' // Under the hood, document.querySelectorAll is used
```

## Keyframes
Array with one multiple objects.
When one object is specified, it's like 'TO' direction.
Use all CSS(Js) property you want.

```JS
// Keyframes
[
  {transform: 'translate3d(0, 0, 0)', backgroundColor: 'red'},
  {transform: 'translate3d(0, 100px, 0)', backgroundColor: 'green'},
]
```

## Options
Set your options, they all have a default value specified.
You can use an anonymous function on every property.

```JS
// Options
{
  duration: () => Math.floor(Math.random() * 10000);
}
```

```JS
const anotherTarget = document.querySelector('#anotherTarget');

// Inject in var for timeline usage
const myAnimation = animate( 

  // Targets (string, object or array)
  ['.targets', anotherTarget], 

  // Keyframes (array)
  [
    {transform: 'translate3d(0, 0, 0)', backgroundColor: 'red'},
    {transform: 'translate3d(0, 100px, 0)', backgroundColor: 'green'},
  ],

  // Options (object)
  {
    duration: 1000, // animation's duration in ms (number, object) | default: 1000
    direction: 'normal', // 'normal', 'reverse', 'alternate' (string) / default: 'normal'
    easing: 'easeOutBack', // easings.net accepted or cubic-bezier (string) | default: 'linear'
    delay: 200, // delay before animation start (number, object) | default: 0
    endDelay: 0, // delay after animation finished (number, object) | default: 0
    iterations: 3, // times the animation is executed (positive number or Infinity) | default: 1
    iterationStart: 1.2, // select at which iteration animation start (number) | default: 0
    fill: 'both', // apply the style to your targets 'none', 'auto', 'backwards', 'forwards', 'both' (string) | default: 'both',
    composite: 'replace', // choose how each keyframe impact the style, 'replace', 'add', 'accumulate' | default: 'replace'
    playbackRate: 1, // choose the speed of your animation without changing duration (+ / - number) | default: 1
    autoplay: false, // start animation when ready (boolean) | default: false
    commitStyles: false, // option that apply css style to targets after animation finished | default: false
    autocancel: false, // remove animation from browser at the end | default: false
    willChange: false, // add and remove automatically a 'will-change: transform' to your target during animation | default: false
  }
)

myAnimation.play();
```

## Running
Animation is not running by default, you have two options: 
```JS
// Options
{ autoplay: true }
```

or

```JS
// Method
myAnimation.play();
```

## Methods

### Player

```JS
myAnimation.play();

setTimeout(() => {
  myAnimation.pause();
}, 2500);
```

### .play()
Start the animation.

### .reverse()
Reverse the current playbackRate and play animation.

### .pause()
Pause the animation.

### .reset()
Go back to first frame and pause animation.

### .restart()
Go back to first frame and play animation.

### .finish()
Go back to the last frame animation.

### .cancel()
Stop and remove animation from browser.

### .seek(number)
Go to a specific moment of animation (number from 0 to 1).

### Getters
```JS
myAnimation.getPlayState();
// 'running'
```

### .getDuration()
Return the total duration with duration, delays, iterations ...

### .getCurrentIteration()
Return the current iteration when executed.

### .getPlayState()
Return the animation's status: 'idle', 'running', 'finished'.

### .getPlaybackRate()
Return the current playbackRate.

### .getProgress() // Soon
Return the current progression (from 0 to 1).

### Setters
```JS
myAnimation.setDirection('alternate');
```

### .setDirection(string)
Set a new direction ('normal', 'reverse', 'alternate').

### .setPlaybackRate(number)
Set a new playbackRate ( + / - number). Change the speed of animation.

### .setWillChange(boolean)
Set the option willChange to true or false.

### .setCommitStyles()
Set the option commitStyles to true or false.

### Events
```JS
myAnimation.onready(() => {
  console.log('Ready to play !');
});
```

### .onready()
Execute when animation is ready.

### .onplay()
Execute when animation is playing.

### .onpause()
Execute when animation is paused.

### .onfinish()
Execute when animation is finished.

### .onremove()
Execute when animation is removed (everytime the animation is paused/play or changed);

### .oncancel()
Execute when animation is canceled.


## Stagger

Stagger can be used on every options property you want.

```JS
// Options
{
  delay: {stagger: 200},
  duration: {default: 2500, stagger: 100}
}
```

## Timeline

```JS
import { animate, timeline } from 'unanime';

const tl = timeline(
  // Animations list
  [
    { animate: myAnimation1},
    { animate: myAnimation2, start: '<+800'},
  ],
  // Timeline options
  {autoplay: false, iterations: Infinity, direction: 'alternate'}
)

timeline.play();
```

### Animation start
You can change the start point of each animations within the timeline by adding 'start'.

### Relative position
Use ***STRING*** to change the relative position of your animation.

```JS
{animate: myAnimation2, start: '+200'}, // +200ms from the relative start
{animate: myAnimation2, start: '-600'},
{animate: myAnimation2, start: '<'}, // start with the previous animation
{animate: myAnimation2, start: '<<<'}, // previous * 3
{animate: myAnimation2, start: '<<+800'},
{animate: myAnimation2, start: '<-1200'}
```

### Absolute position
Use ***NUMBER*** to change the absolute position of your animation.

```JS
{animate: myAnimation2, start: 6500} // start at 6500ms after the timeline started
```

