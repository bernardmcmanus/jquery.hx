# jQuery.hx

#### A hardware-accelerated animation library for mobile and desktop.
=====

### Overview
hx is a jQuery plugin which enables you to use the hardware-accelerated transformations baked into CSS3 without any additional code. The plugin is called as follows:
```javascript
$('selector').hx( 'action' , options );
```
To peform multiple transformations simultaneously, the plugin calls can be chained:
```javascript
$('selector')
.hx( 'action1' , options )
.hx( 'action2' , options );
```
The __done__ method provides a means to trigger a callback once all chained animations are complete:
```javascript
$('selector')
.hx( 'action1' , options )
.hx( 'action2' , options )
.done(function() {
    // do stuff here
});
```
=====

### Actions

The following code blocks show the available actions called with their respective default option values.

#### transform
```javascript
$('selector').hx( 'transform' , {
    translate: {x: 0, y: 0, z: 0},
    scale: {x: 1, y: 1, z: 1},
    rotate: {x: 0, y: 0, z: 0, a: 0},
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    duration: 400,
    easing: 'ease',
    delay: 0,
    relative: true
});
```

#### fadeIn
```javascript
$('selector').hx( 'fadeIn' , {
    duration: 400,
    easing: 'ease',
    delay: 0
});
```

#### fadeOut
```javascript
$('selector').hx( 'fadeOut' , {
    duration: 400,
    easing: 'ease',
    delay: 0,
    pseudoHide: true
});
```

#### cancel
Triggering the cancel action will allow an element to finish its current animation frame, but will prevent callbacks from being fired upon completion. Any subsequent frames will not be executed.
```javascript
$('selector').hx( 'cancel' );
```

#### debug
Turns on debugging output for specified events.
```javascript
$('selector').hx( 'debug' , {
    events: [],
    log: function( msg ) {
        console.log( msg );
    }
});
```
=====

### Options

#### easing

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

Custom easing is passed as an object with four points, p<sub>n</sub>:

```javascript
$('selector').hx( 'transform' , {
    ...
    easing: {p1: 0.17, p2: 0.67, p3: 0.38, p4: 0.67},
    ...
});
```

#### relative

The relative option controls whether a transformation is applied relative to previous transformations. For example, the following snippet will translate an element 50 pixels to the left every time it is applied:
```javascript
$('selector').hx( 'transform' , {
    translate: {x: 50}
});
```

When relative is set to false, the element will always be translated to (50, 0, 0):
```javascript
$('selector').hx( 'transform' , {
    translate: {x: 50},
    relative: false
});
```

#### pseudoHide

The pseudoHide option is necessary for full compatibility in Firefox and the native browser on certain Android devices. When pseudoHide is true, elements that are faded out will be hidden using the opacity and pointer-events properties. In most cases the result is functionaly equivalent to setting display equal to none, but allows for retrieval of the element's computed style.

=====

### Events

#### hx_init

Fires when a new hxManager instance is created.

```javascript
event.detail: {}
```

#### hx_setTransition

Fires when transition duration, delay, or easing are updated.

```javascript
event.detail: {
    propertyName: String,
    string: String
}
```

#### hx_applyXform

Fires when a new transformation is applied.

```javascript
event.detail: {
    propertyName: String,
    string: String,
    xform: Object
}
```

#### hx_transitionEnd

Fires upon completion of individual transitions.

```javascript
event.detail: {
    propertyName: String
}
```

#### hx_fallback

Fires when the fallback timeout is triggered.

```javascript
event.detail: {
    propertyName: String
}
```

#### hx_cancel

Fires when an hxManager instance is canceled.

```javascript
event.detail: {}
```

#### hx_done

Fires upon completion of all chained transitions.

```javascript
event.detail: {}
```

=====

### Examples

Translate the element 300 pixels along the x axis and 150 along the y.
```javascript
$('selector').hx( 'transform' , {
    translate: {x: 300, y: 150}
});
```

Same as above, but this time scale the element by a factor of 1.5 along the x and y axes.
```javascript
$('selector').hx( 'transform' , {
    translate: {x: 300, y: 150},
    scale: {x: 1.5, y: 1.5}
});
```

Next, add a 180-degree rotation about the z axis.
```javascript
$('selector').hx( 'transform' , {
    translate: {x: 300, y: 150},
    scale: {x: 1.5, y: 1.5},
    rotate: {z: 1, a: 180}
});
```

Now, fade the element out part way through the animation.
```javascript
$('selector')
.hx( 'transform' , {
    translate: {x: 300, y: 150},
    scale: {x: 1.5, y: 1.5},
    rotate: {z: 1, a: 180}
})
.hx( 'fadeOut' , {
    duration: 300,
    delay: 200
});
```

Finally, use the __done__ method to fade the element back in and return it to its original size and position.
```javascript
$('selector')
.hx( 'transform' , {
    translate: {x: 300, y: 150},
    scale: {x: 1.5, y: 1.5},
    rotate: {z: 1, a: 180}
})
.hx( 'fadeOut' , {
    duration: 300,
    delay: 200
})
.done(function() {
    $(this)
    .hx( 'fadeIn' )
    .hx( 'transform' , {
        relative: false
    });
});
```

=====

### Order Matters!

#### Hidden Elements

In general, you should not apply a transformation to a hidden element without first taking steps to make it visible. For example, if you are chaining transform and fadeIn actions, make sure the fadeIn call is placed _before_ the transform call.

```javascript
$('selector')
.hx( 'fadeIn' )
.hx( 'transform' , {
    ...
});
```

Inversely, if you are chaining transform and fadeOut actions, make sure the fadeOut call is placed _after_ the transform call.

```javascript
$('selector')
.hx( 'transform' , {
    ...
})
.hx( 'fadeOut' );
```

#### Transformations

The order in which you apply transformations will affect the final outcome. For instance, the following snippet will translate an element 100 pixels to the right and scale it by a factor of 2 along the x axis.

```javascript
$('selector').hx( 'transform' , {
    translate: {x: 100},
    scale: {x: 2}
});
```

However if scale is applied first, the element will be translated 200 pixels.

```javascript
$('selector').hx( 'transform' , {
    scale: {x: 2},
    translate: {x: 100}
});
```

=====

### Compatibility

jQuery.hx is supported in both mobile and desktop versions of all major browsers including Chrome, Safari, Firefox, Opera, and Internet Explorer 9+.

=====

### Build Instructions

You need NPM installed. Navigate to the git directory and run the following commands:

    npm install
    grunt
