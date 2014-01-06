# jQuery.hx

#### A hardware-accelerated animation library for webkit mobile devices.
=====

### Overview
The hx plugin allows you to use the hardware-accelerated transformations baked into CSS3 without any additional code. The plugin is called as follows:
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
=====

### Options

#### easing

<table>
    <tr>
        <td>linear</td>
        <td>ease</td>
        <td>ease-in</td>
        <td>ease-out</td>
    </tr>
    <tr>
        <td>ease-in-out</td>
        <td>easeInQuad</td>
        <td>easeInCubic</td>
        <td>easeInQuart</td>
    </tr>
    <tr>
        <td>easeInQuint</td>
        <td>easeInSine</td>
        <td>easeInExpo</td>
        <td>easeInCirc</td>
    </tr>
    <tr>
        <td>easeInBack</td>
        <td>easeOutQuad</td>
        <td>easeOutCubic</td>
        <td>easeOutQuart</td>
    </tr>
    <tr>
        <td>easeOutQuint</td>
        <td>easeOutSine</td>
        <td>easeOutExpo</td>
        <td>easeOutCirc</td>
    </tr>
    <tr>
        <td>easeOutBack</td>
        <td>easeInOutQuad</td>
        <td>easeInOutCubic</td>
        <td>easeInOutQuart</td>
    </tr>
    <tr>
        <td>easeInOutQuint</td>
        <td>easeInOutSine</td>
        <td>easeInOutExpo</td>
        <td>easeInOutCirc</td>
    </tr>
    <tr>
        <td>easeInOutBack</td>
        <td>easeOutBackMod1</td>
        <td>easeMod1</td>
        <td>custom</td>
    </tr>
</table>

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

The pseudoHide option is necessary for full compatibility within the native browser on certain Android devices. When pseudoHide is true, elements that are faded out will be hidden using the opacity and pointer-events properties. In most cases the result is functionaly equivalent to setting display equal to none, but allows for retrieval of the element's computed style.

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

Now, fade the element out part way through the animation.
```javascript
$('selector')
.hx( 'transform' , {
    translate: {x: 300, y: 150},
    scale: {x: 1.5, y: 1.5}
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
    scale: {x: 1.5, y: 1.5}
})
.hx( 'fadeOut' , {
    duration: 300,
    delay: 200
})
.done(function() {
    $(this)
    .hx( 'fadeIn' )
    .hx( 'transform' , {
        translate: {x: 0, y: 0},
        scale: {x: 1, y: 1},
        relative: false
    });
});
```

=====

### Build Instructions

You need NPM installed. Navigate to the git directory and run the following commands:

    npm install
    grunt
