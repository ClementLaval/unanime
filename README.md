# <div align="center">unanime.js</div>

***<div align="center">Javascript animation library build on top of web animation API (WAAPI).</div>***

<div align="center">


*Learn more about WAAPI:*

[Web animation API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)

[Blog Daniel C. Wilson](https://danielcwilson.com/blog/2015/07/animations-intro/)
</div>


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
const animate = require('unanime');
````

&nbsp;
# Quick start

## Example
```JS
import { animate } from 'unanime';

const myAnimation = animate(
  '.targets', 
  [
    {transform: 'translateX(100px)'}
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
### Offset
Add 'offset' property in a single frame to change the effect duration. (endpoint)

Example:

```JS
// Keyframes
[
  {opacity: 0,},
  {opacity: 0.2, offset: 0.8}, // opacity takes 0.8 of the animation duration to become 0.2
  {opacity: 1}
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
    // easings.net accepted, basic css or cubic-bezier (string) | default: 'linear'
    delay: 200, 
    // delay before animation start (number, object) | default: 0
    endDelay: 0, 
    // delay after animation finished (number, object) | default: 0
    iterations: 3, 
    // times the animation is executed (positive number or Infinity) | default: 1
    iterationStart: 1.2, 
    // select at which iteration animation start (number) | default: 0
    fill: 'both', 
    // apply the style to your targets 'none', 'auto', 'backwards', 'forwards', 'both' (string) | default: 'both'
    composite: 'replace', 
    // choose how each keyframe impact the style, 'replace', 'add', 'accumulate' | default: 'replace'
    playbackRate: 1, 
    // choose the speed of your animation without changing duration (+ / - number) | default: 1
    autoplay: false, 
    // start animation when ready (boolean) | default: false
    initStyles: true,
    // option that apply css style (first keyframes) to the target | default: false
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
## Easing
You can use normal css easing like 'ease-in' or cubic-bezier() property.
You can also use presets from [Easing.net](https://easings.net/) as string.

### Spring() effect
A spring effect is include, simply use 'spring()' as string in your easing option.
Read [this page](https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/) to learn more about spring effect and use the simulator.

```JS
// Options
{
  easing: 'spring()' // will be init with default config spring(50, 1, 10)
}
```
You can also change spring settings:
```JS
 easing: 'spring(stiffness, mass, damping, offset)'
 // stiffness: min 50 || default 50
 // mass: min 1 || default 1
 // damping: min 1 || default 10
 // offset: min 0.1 || default 1
```
I recommand you to change only the first param "stiffness" only at beginning, more you change "mass" more you need to calculate animations steps positions. Damping don't really need to be change.
Don't forget to change the animation duration to have a good feelings.

### Log steps count
You can check the number of computed steps by adding 'log' in your string.
```JS
 easing: 'spring(250) log'
 // 82
```
### Offset
Sometimes the end of animation is a little too long, because of very small movements computed. You can decide to cut the end by adding the last param (offset): 1 = full animation , 0.5 = half.

### Caution
Only two keyframes can be set within the array. Be sure to specify properties in exact same order.
```JS
// Keyframes
[
  {transform: 'translateX(100%) scale(0.3)', opacity: 0}, 
  {transform: 'translateX(0) scale(1)', opacity: 1}      
]
```
Warning: some settings can cause infinite loop, in this case try another params.

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
Go immediatly to a specific moment of animation (number from 0 to 1).

#### .scrub(number, options)
Go smoothely to a specific moment, new direction is calculed from the previous position, pass pinOptions as second argument ({smoothness: 0.05, delay: 0} // default)

&nbsp;
### Target specific index
You can target a specific animation inside your animate targets's array, by adding the index as last argument (start at 0).

&nbsp;

*Example:*
```JS
myAnimation.play();

setTimeout(() => {
  myAnimation.pause(2);
  // pause the 3th target's animation after 2500ms
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

#### .setInitStyles(boolean)
Set the option initStyles to true or false.

#### .setCommitStyles(boolean)
Set the option commitStyles to true or false.

&nbsp;

*Example:*
```JS
myAnimation.setDirection('alternate');
```
&nbsp;

Events
---

#### .onReady()
Execute when animation is ready.

#### .onPlay()
Execute when animation is playing.

#### .onPause()
Execute when animation is paused.

#### .onFinish()
Execute when animation is finished.

#### .onRemove()
Execute when animation is removed (everytime the animation is paused/play or changed);

#### .onCancel()
Execute when animation is canceled.

&nbsp;

*Example:*
```JS
myAnimation.onReady(() => {
  console.log('Ready to play !');
});
```
&nbsp;
## Stagger

Staggering allows you to animate multiple elements with follow through and overlapping action.


*Example:*
```JS
// Options
{delay: {stagger: 100, from: 'center', direction: 'normal'}}
```

&nbsp;
### Structure
```JS
// Options
{ yourOption: {
    default: 0, // initial value of your option added to stagger | default: option's default
    stagger: 100, // amount that will be multiplied by array index (number) | default: 0
    from: 3, // choose the starting point of your stagger propagation (string, number, array) | default: 'start'
    direction: 'reverse' // select the way stagger in computed (string) | default: 'normal'
  }
}
```

&nbsp;

### from:
There are different ways to set 'from' option in stagger object.

```JS
'start', 'center', 'end' // select one mode
or
10 // select array index(+1)
or
[2, 7, 13] // select multiple starting points
```

&nbsp;

### direction:
Select the propagation's direction.

```JS
'normal' // default
or
'reverse'
```

&nbsp;

Stagger can be used on every options property who takes a number.
*Example:*
```JS
// Options
{
  delay: {stagger: 200},
  duration: {default: 2500, stagger: 100},
  iterations: {default: 4, stagger: 0.05},
  iterationStart: {default: 1, stagger: 0.02},
  playbackRate: {default: 1, stagger: 0.05},
  ...
}
```

### Easing stagger
Easing can accept an array to set different easing on each elements of your targets.
You can directly use this [list of easing](https://easings.net/) as string.
```JS
// Options
{
  easing: ['easeInCirc', null, 'ease-out', 'cubic-bezier(.17,.67,.83,.67)'] 
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


### Animation start

You can change the start point of each animations within the timeline by adding 'start'.

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

### Absolute position
Use ***NUMBER*** to change the absolute position of your animation.

```JS
{animate: myAnimation2, start: 6500} // start at 6500ms after the timeline started
```

&nbsp;
## Scroll Trigger (Observer)

Observer is a module to trigger your animation by scrolling (build with Intersection Observer API).
Please be sure to undestand how works the API to use it (root, target, threshold ...) [Intersection Observer API Doc](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

```JS
// Options
{
  observer: {
    root: null,
    // set the root element, by default null automatically select the viewport (most of time, don't change this property)
    rootMargin: '0px 0px 20% 0px',
    // change root size by adding + / - margins, define in string as classic margins (px and % only)
    target: '#sectionId',
    // by default target automatically select the animation's target (auto detect array create only one observer on direct parent), change it to trigger the animation from another area. Under the hood a layout is created at the end of the body with class=${targetId}-intersection-observer
    targetMargin: '20% 0px',
    // change target size by adding + / - margins, use a string (px, %, vw ... accepted)
    threshold: 0.3, // default: 0 / if pin is true default: 100
    // set only one threshold if between 0 - 1 (threshold: 0.5) 
    // or an array of threshold (threshold: [0.2, 0.5, 0.8])
    // or automatically calculate an array if you define the number you want (threshold: 36) 
    refreshInterval: 1000,
    // set an interval to refresh target's placement when page's height grow up or during a window resize, default: -1 (disabled)
    markers: true,
    // set markers to true to see helpers on your screen
    once: false,
    // set to true if you want disable the observer once the animation is finished
    split: false,
    // set to true to split each target and control his own animation
    toggleActions: 'play pause reverse reset',
    // set quick actions depending of scroll action (enter / leave / enterback / leaveback)
    // actions list: none, play, pause, resume, reverse, complete, restart, reset
    pin: false,
    // set to true to link your animation with your scroll
    pinOptions: {
      smoothness: 0.05, // default 0.05, go under to give more smoothness
      delay: 80 // default 0, to add delay between scroll and animation
    },
    onEnter: (entry) => {
      console.log('ENTERING' + entry.target);
    },
    // triggered action when root scroll down and enter in target area
    // can access entry
    onLeave: () => {
      console.log('LEAVE');
    },
    // triggered action when root scroll down and leave the target area
    onEnterBack: () => {
      console.log('ENTER BACK');
    },
    // triggered action when root scroll up and enter back in the target area
    onLeaveBack: () => {
      console.log('LEAVE BACK');
    },
      // triggered action when root scroll up and leave back from the target area
    onRefresh: () => {
      console.log('REFRESH OBSERVER');
    },
      // triggered when observer is refreshing
  }
}
```