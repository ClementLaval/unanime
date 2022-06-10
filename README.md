# <div align="center">unanime.js</div>

***<div align="center">Javascript animation library build on top of web animation API (WAAPI).</div>***

<div align="center">

&nbsp;
Learn more about WAAPI:

[Web animation API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)

[Blog Daniel C. Wilson](https://danielcwilson.com/blog/2015/07/animations-intro/)
</div>

&nbsp;

&nbsp;
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

&nbsp;
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
&nbsp;
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
&nbsp;
## Targets
String, Object or Array accepted.

```JS
// Targets
'.myTargets' // Under the hood, document.querySelectorAll is used
```
&nbsp;
## Keyframes
Array with one or multiple objects.
When one object is specified, it's like 'TO' direction.
Use all CSS(Js) property you want.

```JS
// Keyframes
[
  {transform: 'translate3d(0, 0, 0)', backgroundColor: 'red'},
  {transform: 'translate3d(0, 100px, 0)', backgroundColor: 'green'},
]
```
&nbsp;
## Options
Set your options, they all have a default value specified.
You can use an anonymous function on every property.

```JS
// Options
{
  duration: () => Math.floor(Math.random() * 10000); // 5683
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
    duration: 1000, 
    // animation's duration in ms (number, object) | default: 1000
    direction: 'normal', 
    // 'normal', 'reverse', 'alternate' (string) | default: 'normal'
    easing: 'easeOutBack', 
    // easings.net accepted or cubic-bezier (string) | default: 'linear'
    delay: 200, 
    // delay before animation start (number, object) | default: 0
    endDelay: 0, 
    // delay after animation finished (number, object) | default: 0
    iterations: 3, 
    // times the animation is executed (positive number or Infinity) | default: 1
    iterationStart: 1.2, 
    // select at which iteration animation start (number) | default: 0
    fill: 'both', 
    // apply the style to your targets 'none', 'auto', 'backwards', 'forwards', 'both' (string) | default: 'both',
    composite: 'replace', 
    // choose how each keyframe impact the style, 'replace', 'add', 'accumulate' | default: 'replace'
    playbackRate: 1, 
    // choose the speed of your animation without changing duration (+ / - number) | default: 1
    autoplay: false, 
    // start animation when ready (boolean) | default: false
    commitStyles: false, 
    // option that apply css style to targets after animation finished | default: false
    autocancel: false, 
    // remove animation from browser at the end | default: false
    willChange: false, 
    // add and remove automatically a 'will-change: transform' to your target during animation | default: false
  }
)

myAnimation.play();
```
&nbsp;
## Running
Animation is not running by default, you have three options: 
```JS
// Options
{ autoplay: true }
```

or

```JS
// Method
myAnimation.play();
```

or

```JS
// Timeline
const tl = timeline(
  [
    {animate: myAnimation}
  ] 
)
tl.play();
```
&nbsp;
# Methods

Player
---

#### .play()
Start the animation.

#### .reverse()
Reverse the current playbackRate and play animation.

#### .pause()
Pause the animation.

#### .reset()
Go back to first frame and pause animation.

#### .restart()
Go back to first frame and play animation.

#### .finish()
Go to the last frame animation.

#### .cancel()
Stop and remove animation from browser.

#### .seek(number)
Go to a specific moment of animation (number from 0 to 1).

&nbsp;

*Example:*
```JS
myAnimation.play();

setTimeout(() => {
  myAnimation.pause();
}, 2500);
```
&nbsp;

Getters
---

#### .getDuration()
Return the total duration with duration, delays, iterations ...

#### .getCurrentIteration()
Return the current iteration when executed.

#### .getPlayState()
Return the animation's status: 'idle', 'running', 'finished'.

#### .getPlaybackRate()
Return the current playbackRate.

#### .getProgress() // Soon
Return the current progression (from 0 to 1).

&nbsp;

*Example:*
```JS
myAnimation.getPlayState();
// 'running'
```
&nbsp;


Setters
---

#### .setDirection(string)
Set a new direction ('normal', 'reverse', 'alternate').

#### .setPlaybackRate(number)
Set a new playbackRate ( + / - number). Change the speed of animation.

#### .setWillChange(boolean)
Set the option willChange to true or false.

#### .setCommitStyles()
Set the option commitStyles to true or false.

&nbsp;

*Example:*
```JS
myAnimation.setDirection('alternate');
```
&nbsp;

Events
---

#### .onready()
Execute when animation is ready.

#### .onplay()
Execute when animation is playing.

#### .onpause()
Execute when animation is paused.

#### .onfinish()
Execute when animation is finished.

#### .onremove()
Execute when animation is removed (everytime the animation is paused/play or changed);

#### .oncancel()
Execute when animation is canceled.

&nbsp;

*Example:*
```JS
myAnimation.onready(() => {
  console.log('Ready to play !');
});
```
&nbsp;
## Stagger

Stagger can be used on every options property you want.

```JS
// Options
{
  delay: {stagger: 200},
  duration: {default: 2500, stagger: 100}
}
```

### Easing stagger
Easing can accept an array to set different easing on each elements of your targets.
```JS
// Options
{
  easing: ['easingInCirc', null, 'ease-out', 'cubic-bezier(.17,.67,.83,.67)'] 
  // if null, get previous easing
}
```

&nbsp;
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

tl.play();
```
&nbsp;
### Animation start
You can change the start point of each animations within the timeline by adding 'start'.

&nbsp;
### Relative position
Use ***STRING*** to change the relative position of your animation.

```JS
{animate: myAnimation1, start: '+200'}, // +200ms from the relative start
{animate: myAnimation2, start: '-600'},
{animate: myAnimation3, start: '<'}, // start with the previous animation
{animate: myAnimation4, start: '<<<'}, // previous * 3 (myAnimation1)
{animate: myAnimation5, start: '<<+800'},
{animate: myAnimation6, start: '<-1200'}
```
&nbsp;
### Absolute position
Use ***NUMBER*** to change the absolute position of your animation.

```JS
{animate: myAnimation2, start: 6500} // start at 6500ms after the timeline started
```

---
