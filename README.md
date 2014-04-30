# jQuery.hx

#### A hardware-accelerated animation library for mobile and desktop.
=====

### Overview

hx is a JavaScript animation library that couples the slick animation capabilities of CSS3 with the power and flexibility of JS, making complex animation sequences a breeze. It's written as a jQuery plugin and uses the familiar syntax:

```javascript
$('selector').hx( arguments );
```

=====

### The Basics

###### Queueing

More to come on queueing. For now, it's important to know that each element in an hx instance has its own queue which executes independently. This allows us to do things like:

```javascript
    $('sel1').hx({
        ...
        duration: 400
    });

    $('sel2').hx({
        ...
        duration: 800
    });

    $('sel3').hx({
        ...
        duration: 1200
    });

    $('sel1').hx({
        ...
        duration: 800,
        delay: 400
    });

    $('sel1,sel2,sel3').hx( 'done' , function() {
        // this function will be executed after 1600ms
    });
```

###### Beans & Pods

The hx method accepts a single transformation object, or __bean__:

```javascript
    $('selector').hx({
        ...
    });
```

as well as an array of beans, or __pod__:

```javascript
    $('selector').hx([
        { ... },
        { ... }
    ]);
```

* Pods execute _synchronously_, meaning each pod in the queue will not run until the pod before it has been resolved. A pod will be resolved once all of its beans have been resolved.
* Beans of the same type execute synchronously. Within a pod, each bean<sub>a</sub> will not run until the bean<sub>a</sub> before it has been resolved.
* Beans of different types execute _asynchronously_. Within a pod, bean<sub>a</sub> and bean<sub>b</sub> can run simultaneously.

It's important to note that passing a transformation to the hx method will always create a pod. In the following snippet, the transform and opacity beans will execute simultaneously because they are in the same pod:

```javascript
    $('selector').hx([
        {
            type: 'transform'
        },
        {
            type: 'opacity'
        }
    ]);
```

However, if we separate the beans into two hx calls, the second pod will not execute until the first pod is resolved:

```javascript
    $('selector')
    .hx({
        type: 'transform'
    })
    .hx({
        type: 'opacity'
    });
```

###### Promises

hx is bundled with the latest promises <a href="http://s3.amazonaws.com/es6-promises/promise-0.1.1.min.js" target="_blank">polyfill</a>, so it will work even in browsers that have not yet implemented promises. If you're not familiar with the concept of promises, you may find these resources helpful:
* <a href="http://www.html5rocks.com/en/tutorials/es6/promises/" target="_blank">Intro to Promises</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">MDN Promises Documentation</a>

=====

### Animations

##### Operators, Values, and Persistent States
hx supports the use of assignment operators (`+=`, `-=`, `*=`, `/=`, and `%=`) to perform relative changes:
```javascript
    $('selector').hx({
        type: 'transform',
        rotateZ: '-=1',
        translate: {y: '+=1'}
    });
```

A numeric value represents an absolute transform:
```javascript
    $('selector').hx({
        type: 'transform',
        translate: {y: 100}
    });
```

Information about transforms that have been applied to an element will persist until the property is reset:
```javascript
    $('selector').hx({
        type: 'transform',
        translate: {x: 50}
    });

    // some time later...

    $('selector').hx({
        type: 'transform',
        translate: {y: 100}
    });

    // the translate.x component persists
    // so the element is translated to (50,100)
```

A property can be reset by setting it to null:

```javascript
    $('selector').hx({
        type: 'transform',
        translate: null
    });

    // the element is translated to (0,0)
```

##### Hardware-Accelerated (3D) Transforms
```javascript
type: 'transform'
```
###### translate
```javascript
translate: {x: 0, y: 0, z: 0}
```
###### scale
```javascript
scale: {x: 1, y: 1, z: 1}
```
###### rotate
```javascript
rotate: {x: 0, y: 0, z: 0, a: 0}
```
###### rotateX
```javascript
rotateX: 0
```
###### rotateY
```javascript
rotateY: 0
```
###### rotateZ
```javascript
rotateZ: 0
```

##### Non Hardware-Accelerated (2D) Transforms
```javascript
type: 'transform'
```
###### translate2d
```javascript
translate2d: {x: 0, y: 0}
```
###### scale2d
```javascript
scale2d: {x: 0, y: 0}
```

##### Non-Transform Types

Although opacity is the only officially supported non-transform type, hx should handle any transitionable CSS property. The syntax for non-transform CSS properties is shown below.

```javascript
// numeric values
type: 'opacity',
value: 0

// string values
type: 'background-color',
value: '#fff'
```

* __NOTE:__ non-transform properties cannot be hardware-accellerated.

=====

### Methods

##### Overview

hx methods can be called in two ways:
* Inline, chained to an hx call, or
* Standalone, by passing the method name as the first argument of an hx call

The following snippets are functionally equivalent:

```javascript
$('selector').hx({
    ...
})
.done(function() {
    // it's done!
});
```

```javascript
$('selector').hx({
    ...
});

$('selector').hx( 'done' , function() {
    // it's done!
});
```

##### Synchronous Methods

###### hx
* Applies a transformation if the first argument is an object __(bean)__ or array __(pod)__, or calls another method if the first argument is a string.

###### defer
* Prevents the queue from executing for a set amount of time, or until `resolve` is called.
* Optional: `Integer`

```javascript
$('selector')
.hx( 'defer' , 500 )
.hx({
    ... // this pod will run after 500ms
})
.defer()
.hx({
    ... // this pod won't run yet
});

// some time later...
$('selector').hx( 'resolve' );
// now the last pod will run
```

###### then
* Required: `Function`
* `resolve` allows the queue to continue.
* `reject` stops execution and clears the queue.
* __NOTE:__ failing to resolve or reject the promise created by `then` will cause a queue jam.

```javascript
$('selector')
.hx({
    ...
})
.then(function( resolve , reject ) {
    if (awesome) {
        resolve();
    } else {
        reject();
    }
})
.hx({
    ...
    // this pod runs if the promise is resolved
    // if the promise is rejected, the queue is cleared
    // and this pod is not executed
});
```

###### race
* Required: `Function`
* `resolve` allows the queue to continue.
* `reject` stops execution and clears the queue.
* __NOTE:__ failing to resolve or reject the promise created by `race` will cause a queue jam.

```javascript
$('selector1').hx({
    ...
    duration: (1000 * Math.random())
});

$('selector2').hx({
    ...
    duration: (1000 * Math.random())
});

$('selector1, selector2')
.hx( 'race' , function( resolve , reject ) {
    // this function runs when the first
    // element finishes its animation
    resolve();
});

$('selector1').hx({
    ... // this pod runs when race is resolved
});
```

###### done
* Required: `Function`
* `done` performs the same way as `then`, but does not create a promise that needs to be resolved. It is intended for use at the end of an animation chain.

```javascript
$('selector1').hx({
    ...
    duration: (1000 * Math.random())
});

$('selector2').hx({
    ...
    duration: (1000 * Math.random())
});

$('selector1, selector2').hx( 'done' , function() {
    // it's done!
});
```

##### Asynchronous Methods

###### clear
* Clears all pods in the queue.

```javascript
$('selector').hx( 'clear' );
```

###### break
* Clears all but the current pod in the queue.

```javascript
$('selector').hx( 'break' );
```

###### update
* Required: `Object`
* Updates an element's stored information without applying a transform.

```javascript
$('selector').hx( 'update' , {
    type: 'transform',
    translate: null
});
```

###### resolve
* Optional: `Boolean`
* Resolves the current promise pod in the queue. If `true` is passed, the current pod will be resolved regardless of whether it is a promise or an animation pod.

```javascript
$('selector')
.hx({
    ... // this pod will be resolved before it is complete
})
.hx({
    ...
});

// jump to the next animation pod
$('selector').hx( 'resolve' , true );
```

###### zero
* Required: `Object`
* `zero` should be used to apply multiple transforms in rapid succession (like dragging an element).
* __NOTE:__ `zero` will apply a single transition, then clear the queue. Don't use zero in combination with any other methods.

```javascript
$('selector').hx( 'zero' , {
    translate: {
        x: ('+=' + delta.x),
        y: ('+=' + delta.y)
    }
});
```

=====

### Options

##### General Options

###### type
The CSS property to be animated, i.e. transform, opacity, etc.
* `String`
* __Required__
* Default: n/a

###### duration
The transition duration in milliseconds.
* `Integer`
* _Optional_
* Default: 400

###### delay
The transition delay in milliseconds.
* `Integer`
* _Optional_
* Default: 0

###### fallback
By default, hx creates a fallback timeout to ensure transition end events are captured and prevent queue jams from occurring. This can be disabled at the bean level by passing `fallback: false`.
* `Boolean`
* _Optional_
* Default: true

###### done
A callback to be executed upon bean completion.
* `Function`
* _Optional_
* Default: null

###### easing
The transition easing.
* `String || Object`
* _Optional_
* Default: ease

<table>
    <tr>
        <td><a href="http://cubic-bezier.com/#.25,.25,.75,.75" target="_blank">linear</a></td>
        <td><a href="http://cubic-bezier.com/#.25,.1,.25,1" target="_blank">ease</a></td>
        <td><a href="http://cubic-bezier.com/#.42,0,1,1" target="_blank">ease-in</a></td>
        <td><a href="http://cubic-bezier.com/#0,0,.58,1" target="_blank">ease-out</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.42,0,.58,1" target="_blank">ease-in-out</a></td>
        <td><a href="http://cubic-bezier.com/#.55,.085,.68,.53" target="_blank">easeInQuad</a></td>
        <td><a href="http://cubic-bezier.com/#.55,.055,.675,.19" target="_blank">easeInCubic</a></td>
        <td><a href="http://cubic-bezier.com/#.895,.03,.685,.22" target="_blank">easeInQuart</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.755,.05,.855,.06" target="_blank">easeInQuint</a></td>
        <td><a href="http://cubic-bezier.com/#.47,0,.745,.715" target="_blank">easeInSine</a></td>
        <td><a href="http://cubic-bezier.com/#.95,.05,.795,.035" target="_blank">easeInExpo</a></td>
        <td><a href="http://cubic-bezier.com/#.6,.04,.98,.335" target="_blank">easeInCirc</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.6,-0.28,.735,.045" target="_blank">easeInBack</a>*</td>
        <td><a href="http://cubic-bezier.com/#.25,.46,.45,.94" target="_blank">easeOutQuad</a></td>
        <td><a href="http://cubic-bezier.com/#.215,.61,.355,1" target="_blank">easeOutCubic</a></td>
        <td><a href="http://cubic-bezier.com/#.165,.84,.44,1" target="_blank">easeOutQuart</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.23,1,.32,1" target="_blank">easeOutQuint</a></td>
        <td><a href="http://cubic-bezier.com/#.39,.575,.565,1" target="_blank">easeOutSine</a></td>
        <td><a href="http://cubic-bezier.com/#.19,1,.22,1" target="_blank">easeOutExpo</a></td>
        <td><a href="http://cubic-bezier.com/#.075,.82,.165,1" target="_blank">easeOutCirc</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.175,.885,.32,1.275" target="_blank">easeOutBack</a>*</td>
        <td><a href="http://cubic-bezier.com/#.455,.03,.515,.955" target="_blank">easeInOutQuad</a></td>
        <td><a href="http://cubic-bezier.com/#.645,.045,.355,1" target="_blank">easeInOutCubic</a></td>
        <td><a href="http://cubic-bezier.com/#.77,0,.175,1" target="_blank">easeInOutQuart</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.86,0,.07,1" target="_blank">easeInOutQuint</a></td>
        <td><a href="http://cubic-bezier.com/#.445,.05,.55,.95" target="_blank">easeInOutSine</a></td>
        <td><a href="http://cubic-bezier.com/#1,0,0,1" target="_blank">easeInOutExpo</a></td>
        <td><a href="http://cubic-bezier.com/#.785,.135,.15,.86" target="_blank">easeInOutCirc</a></td>
    </tr>
    <tr>
        <td><a href="http://cubic-bezier.com/#.68,-0.55,.265,1.55" target="_blank">easeInOutBack</a>*</td>
        <td><a href="http://cubic-bezier.com/#.7,-1,.5,2" target="_blank">easeOutBackMod1</a>*</td>
        <td><a href="http://cubic-bezier.com/#.25,.2,.25,1" target="_blank">easeMod1</a></td>
        <td>custom</td>
    </tr>
</table>

<sup>*Bezier curves with values above 1 or below 0 are not compatible on all devices. See <a href="https://bugs.webkit.org/show_bug.cgi?id=45761" target="_blank">WebKit Bug 45761</a>.</sup>

Custom easing can be passed as an object with four points, p<sub>n</sub>, or as a bezier string:

```javascript
$('selector').hx({
    ...
    easing: {p1: 0.17, p2: 0.67, p3: 0.38, p4: 0.67},
    ...
});

// -- OR -- //

$('selector').hx({
    ...
    easing: 'cubic-bezier(0.17, 0.67, 0.38, 0.67)',
    ...
});
```

##### Transform Options

###### transforms
* `Object || Integer || String`
* __Required__ (one or more)
* Default: n/a

###### order
* `Array`
* _Optional_
* Default: n/a

##### Non-Transform Options

###### value
* `Integer || String`
* __Required__
* Default: n/a

=====

### Troubleshooting

###### Transform Order

The order in which transforms are applied will affect the final outcome. The following snippet will actually translate the target by 200 pixels because scale is being applied first.

```javascript
$('selector').hx([
    {
        type: 'transform',
        scale: {x: 2, y: 2}
    },
    {
        type: 'transform',
        translate: {x: '+=100', y: '+=100'}
    }
]);
```

To correct this issue, order can be passed as a property of the second bean.

```javascript
$('selector').hx([
    {
        type: 'transform',
        scale: {x: 2, y: 2}
    },
    {
        type: 'transform',
        translate: {x: '+=100', y: '+=100'},
        order: [ 'translate' , 'scale' ]
    }
]);
```

###### Queue Jams

More on this later. In short, queue jams are caused by an unresolved pod in the queue preventing subsequent pods from being executed. To resolve a single pod:
```javascript
// resolve the current pod if it's a promise
$('selector').hx( 'resolve' );

// resolve the current pod if it's a promise or animation pod
$('selector').hx( 'resolve' , true );
```

Or, to clear the entire queue:

```javascript
$('selector').hx( 'clear' );
```

=====

### Compatibility

hx is supported in both mobile and desktop versions of all major browsers including Chrome, Safari, Firefox, Opera, and Internet Explorer 9+.

=====

### Dependencies

hx requires jQuery 1.10.0 or higher.

=====

### Build Instructions

You need NPM installed. Navigate to the git directory and run the following commands:

    npm install
    grunt
