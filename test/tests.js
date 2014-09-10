(function( QUnit ) {


    QUnit.config.autostart = false;
    QUnit.config.reorder = false;
    QUnit.config.altertitle = false;

    var SELECTOR = '.tgt,.tgt2,.tgt3';
    var METHOD = 1 ? 'animate' : 'iterate';
    var DURATION = 200;
    var EASING = 'linear';

// ======================================== //

    $.hx.defineProperty( 'blur' )
        .set( 'defaults' , 0 )
        .set( 'stringGetter' , blurStringGetter );

    $.hx.defineProperty( 'dropShadow' , 'drop-shadow' )
        .set( 'defaults' , [ 0 , 0 , 0 , 'transparent' ])
        .set( 'keymap' , [ 'x' , 'y' , 'blur' , 'color' ])
        .set( 'stringGetter' , dropShadowStringGetter );


    $.hx.defineProperty( 'clip' )
        .set( 'defaults' , [ 0 , 0 , 0 , 0 ])
        .set( 'keymap' , [ 'top' , 'right' , 'bottom' , 'left' ])
        .set( 'stringGetter' , clipStringGetter );

    function blurStringGetter( name , CSSProperty ) {
        return name + '(' + CSSProperty[0] + 'px)';
    }

    function dropShadowStringGetter( name , CSSProperty ) {
        return name + '(' + CSSProperty.join( 'px ' ) + ')';
    }

    function clipStringGetter( name , CSSProperty ) {
        return 'rect(' + CSSProperty.join( 'px,' ) + 'px)';
    }

// ======================================== //

    QUnit.testDone(function( details ) {
        $(SELECTOR).each(function() {
            var clone = $(this).clone( true );
            clone.attr( 'style' , '' );
            $(this).replaceWith( clone );
        });
    });

// ======================================== //

    QUnit.module( 'general' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING,
        iterations: 3
    });

    QUnit.asyncTest( 'promise digestion' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;
        var iterations = this.iterations;

        expect( iterations + 1 );

        for (var i = 0; i < iterations; i++) {
            $(SELECTOR)
            .hx()
            [ method ]({
                type: 'transform',
                translate: {y: '+=20'},
                duration: Math.ceil( duration / iterations ),
                easing: easing
            })
            .done(function() {
                assert.ok( true , 'promise digested' );
            });
        }

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });

    QUnit.asyncTest( 'property order' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        var expectedOrder = [
            [ 'translate3d' , 'scale3d' ],
            [ 'scale3d' , 'translate3d' ],
            [ 'translate3d' , 'rotateZ' ]
        ];

        expect( 4 );

        $(SELECTOR)
        .hx()
        [ method ]({
            type: 'transform',
            translate: {y: '+=50'},
            scale: {x: '+=0.5', y: '+=0.5'},
            duration: duration,
            easing: easing
        })
        .then(function( resolve ) {
            checkOrder( this , 0 );
            resolve();
        })
        [ method ]({
            type: 'transform',
            scale: {x: '+=0.5', y: '+=0.5'},
            order: [ 'scale' , 'translate' ],
            duration: duration,
            easing: easing
        })
        .then(function( resolve ) {
            checkOrder( this , 1 );
            resolve();
        })
        [ method ]({
            type: 'transform',
            scale: null,
            translate: {y: '+=50'},
            rotateZ: '+=90',
            duration: duration,
            easing: easing
        })
        .then(function( resolve ) {
            checkOrder( this , 2 );
            resolve();
        })
        .done(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });

        function checkOrder( context , i ) {
            var expected = expectedOrder.shift();
            var order = [], controlOrder = [];
            $(context).each(function() {
                order = order.concat(
                    this.$hx.componentMOJO.order.transform
                );
                controlOrder = controlOrder.concat( expected );
            });
            assert.deepEqual( order , controlOrder , ( 'order check ' + i ));
        }
    });

    QUnit.asyncTest( 'transition reset' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        expect( $(SELECTOR).length + 1 );

        $(SELECTOR)
        .hx()
        [ method ]({
            type: 'transform',
            translate: {y: '+=50'},
            scale: {x: '+=0.5', y: '+=0.5'},
            duration: duration,
            easing: easing
        })
        .then(function( resolve ) {
            $(this).each(function( i ) {
                var prefixed = hxManager.VendorPatch.prefix( 'transition' );
                var value = $(this).css( prefixed );
                var assertion = (value === 'all 0s ease 0s' || value === '' || value === 'none');
                assert.ok( assertion , ( 'transition string ' + i ));
            });
            resolve();
        })
        .done(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    QUnit.module( '#$hx' );

    QUnit.test( 'defineProperty' , function( assert ) {

        expect( 15 );

        var blur = hxManager.StyleDefinition.retrieve( 'blur' );

        assert.equal( blur.name , 'blur' , 'blur: name' );
        assert.equal( blur.pName , 'blur' , 'blur: pName' );
        assert.deepEqual( blur.defaults , [ 0 ] , 'blur: defaults' );
        assert.deepEqual( blur.keymap , [ 0 ] , 'blur: keymap' );
        assert.strictEqual( blur.stringGetter , blurStringGetter , 'blur: stringGetter' );

        var dropShadow = hxManager.StyleDefinition.retrieve( 'drop-shadow' );

        assert.equal( dropShadow.name , 'drop-shadow' , 'dropShadow: name' );
        assert.equal( dropShadow.pName , 'dropShadow' , 'dropShadow: pName' );
        assert.deepEqual( dropShadow.defaults , [ 0 , 0 , 0 , 'transparent' ] , 'dropShadow: defaults' );
        assert.deepEqual( dropShadow.keymap , [ 'x' , 'y' , 'blur' , 'color' ] , 'dropShadow: keymap' );
        assert.strictEqual( dropShadow.stringGetter , dropShadowStringGetter , 'dropShadow: stringGetter' );

        var clip = hxManager.StyleDefinition.retrieve( 'clip' );

        assert.equal( clip.name , 'clip' , 'clip: name' );
        assert.equal( clip.pName , 'clip' , 'clip: pName' );
        assert.deepEqual( clip.defaults , [ 0 , 0 , 0 , 0 ] , 'clip: defaults' );
        assert.deepEqual( clip.keymap , [ 'top' , 'right' , 'bottom' , 'left' ] , 'clip: keymap' );
        assert.strictEqual( clip.stringGetter , clipStringGetter , 'clip: stringGetter' );
    });

// ======================================== //

    QUnit.module( '#then' );

    QUnit.asyncTest( 'resolve' , function( assert ) {

        expect( 1 );

        $(SELECTOR)
        .hx()
        .then(function( resolve , reject ) {
            resolve();
        })
        .done(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });

    QUnit.asyncTest( 'reject' , function( assert ) {

        expect( 1 );

        $(SELECTOR)
        .hx()
        .then(function( resolve , reject ) {
            reject();
        })
        .done(function() {
            assert.ok( false , 'this should not run' );
        });

        async(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    QUnit.module( '#update' , {
        beans: [
            {
                type: 'transform',
                translate: {x: 20, y: 20, z: 20},
                rotate: {x: 1, y: 1, z: 1, a: 60},
                scale: {x: 1.2, y: 1.2, z: 1.2},
                rotateX: 20,
                rotateY: 20,
                rotateZ: 20,
                translate2d: {x: 20, y: 20},
                scale2d: {x: 1.2, y: 1.2}
            },
            {
                type: 'opacity',
                value: 0
            },
            {
                type: 'filter',
                blur: 2,
                dropShadow: {x: 10, y: 10, color: 'blue'}
            },
            {
                type: 'clip',
                value: {
                    top: 25,
                    right: 25,
                    bottom: 25,
                    left: 25
                }
            }
        ]
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        expect( 1 );

        var beans = this.beans;

        beans.forEach(function( bean ) {

            $(SELECTOR)
            .hx()
            .update( bean )
            .paint();
        });

        async(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    /*QUnit.module( '#paint' , {
        beans: [
            {
                type: 'transform',
                translate: {x: 20, y: 20, z: 20},
                rotate: {x: 1, y: 1, z: 1, a: 60},
                scale: {x: 1.2, y: 1.2, z: 1.2},
                rotateX: 20,
                rotateY: 20,
                rotateZ: 20,
                translate2d: {x: 20, y: 20},
                scale2d: {x: 1.2, y: 1.2}
            },
            {
                type: 'opacity',
                value: 0
            },
            {
                type: 'filter',
                blur: 2,
                dropShadow: {x: 10, y: 10, color: 'blue'}
            },
            {
                type: 'clip',
                value: {
                    top: 25,
                    right: 25,
                    bottom: 25,
                    left: 25
                }
            }
        ]
    });

    QUnit.asyncTest( 'individual' , function( assert ) {

        var beans = this.beans;

        expect( beans.length + 1 );

        beans.forEach(function( bean ) {

            var type = bean.type;

            $(SELECTOR)
            .hx()
            .update( bean )
            .paint( type );

            var prefixed = hxManager.VendorPatch.prefix( type );
            var re = new RegExp( prefixed );

            var assertion = re.test(
                $(SELECTOR).attr( 'style' )
            );

            assert.ok( assertion , type );

            $(SELECTOR).attr( 'style' , '' );
        });

        async(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });

    QUnit.asyncTest( 'array' , function( assert ) {

        var beans = this.beans;
        var types = [];

        beans.forEach(function( bean ) {

            var type = bean.type;
            var rand = Math.round( Math.random() );

            $(SELECTOR).hx( 'update' , bean );

            if (rand) {
                types.push( type );
            }
        });

        expect( types.length + 1 );

        $(SELECTOR).hx( 'paint' , types );

        var style = $(SELECTOR).attr( 'style' );

        types.forEach(function( type ) {
            var prefixed = hxManager.VendorPatch.prefix( type );
            var re = new RegExp( prefixed );
            var assertion = re.test( style );
            assert.ok( assertion , type );
        });

        async(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });

    QUnit.asyncTest( 'all' , function( assert ) {

        var beans = this.beans;

        expect( beans.length + 1 );

        beans.forEach(function( bean ) {

            var type = bean.type;

            $(SELECTOR)
            .hx()
            .update( bean )
            .paint( type );

            var prefixed = hxManager.VendorPatch.prefix( type );
            var re = new RegExp( prefixed );

            var assertion = re.test(
                $(SELECTOR).attr( 'style' )
            );

            assert.ok( assertion , type );

            $(SELECTOR).attr( 'style' , '' );
        });

        async(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });*/

// ======================================== //

    /*QUnit.module( '#reset' , {
        beans: [
            {
                type: 'transform',
                translate: {x: 20, y: 20, z: 20},
                rotate: {x: 1, y: 1, z: 1, a: 60},
                scale: {x: 1.2, y: 1.2, z: 1.2},
                rotateX: 20,
                rotateY: 20,
                rotateZ: 20,
                translate2d: {x: 20, y: 20},
                scale2d: {x: 1.2, y: 1.2}
            },
            {
                type: 'opacity',
                value: 0
            },
            {
                type: 'filter',
                blur: 2,
                dropShadow: {x: 10, y: 10, color: 'blue'}
            },
            {
                type: 'clip',
                value: {
                    top: 25,
                    right: 25,
                    bottom: 25,
                    left: 25
                }
            }
        ]
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        expect( 1 );

        var beans = this.beans;

        beans.forEach(function( bean ) {

            $(SELECTOR)
            .hx()
            .update( bean )
            .reset()
            .paint();
        });

        async(function() {
            assert.ok( true , 'ok' );
            async(function() {
                QUnit.start();
            });
        });
    });*/

// ======================================== //

    QUnit.module( '#get' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        var Search = [ 'opacity' , 'rotateZ' , 'translate' , 'blur' , 'dropShadow' , 'clip' ];
        var Expected = [];
        var sampleIndex = Math.floor( Math.random() * $(SELECTOR).length );
        var target = $(SELECTOR).get( sampleIndex );

        Expected.push([
            0.8,
            45,
            { x: 0, y: 135, z: 0 },
            10,
            { x: 10, y: 10, blur: 0, color: 'blue' },
            (function() {
                return {
                    left: 0,
                    top: 0,
                    right: $(target).width(),
                    bottom: $(target).height()
                };
            }())
        ]);

        Expected.push([
            1,
            0,
            { x: 0, y: 0, z: 0 },
            0,
            { x: 0, y: 0, blur: 0, color: 'transparent' },
            { left: 0, top: 0, right: 0, bottom: 0 }
        ]);

        expect( Search.length * Expected.length + 1 );

        $(SELECTOR)
        .hx()
        .update([
            {
                type: 'opacity',
                value: 0.8
            },
            {
                type: 'transform',
                translate: {y: '+=135'},
                rotateZ: '+=45'
            },
            {
                type: 'filter',
                blur: 10,
                dropShadow: {x: 10, y: 10, color: 'blue'}
            },
            {
                type: 'clip',
                value: function( element , i ) {
                    return {
                        right: $(element).width(),
                        bottom: $(element).height()
                    };
                }
            }
        ])
        .paint()
        .then(function( resolve ) {
            assert.equal(
                $(SELECTOR).hx( 'get' ).length,
                $(SELECTOR).length,
                'get.length === selector.length'
            );
            compareSample();
            resolve();
        })
        [ method ]([
            {
                type: 'opacity',
                value: null,
                duration: duration,
                easing: easing
            },
            {
                type: 'transform',
                translate: null,
                rotateZ: null,
                duration: duration,
                easing: easing
            },
            {
                type: 'filter',
                blur: null,
                dropShadow: null,
                duration: duration,
                easing: easing
            },
            {
                type: 'clip',
                value: null,
                duration: duration,
                easing: easing
            }
        ])
        .done(function() {
            compareSample();
            async(function() {
                QUnit.start();
            });
        });

        function compareSample() {

            var expected = Expected.shift();

            Search.forEach(function( key , i ) {
                var stored = $(target).hx( 'get' , key )[0];
                assert.deepEqual( stored , expected[i] , ( key + ' = ' + stringify( expected[i] )));
            });
        }

        function stringify( expected ) {
            return typeof expected === 'object' ? JSON.stringify( expected ) : expected;
        }
    });

// ======================================== //

    QUnit.module( '#defer' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING
    });

    QUnit.asyncTest( 'timed' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        expect(( $(SELECTOR).length * 2 ) + 1 );

        $(SELECTOR).each(function( i ) {

            if (i > 0) {
                $(this).hx( 'defer' , (i * duration) );
            }

            $(this)
            .hx()
            .then(function( resolve ) {
                assert.equal( this[0].$hx.queue.length , 4 , ( 'queue length: ' + i ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                rotateZ: '+=360',
                duration: duration,
                easing: easing
            })
            .done(function() {
                assert.ok( true , 'resolved: ' + i );
            });
        });

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });

    QUnit.asyncTest( 'indefinite' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        expect(( $(SELECTOR).length * 2 ) + 1 );

        $(SELECTOR).each(function( i ) {

            if (i > 0) {
                $(this).hx( 'defer' );
            }

            $(this)
            .hx()
            .then(function( resolve ) {
                assert.equal( this[0].$hx.queue.length , 4 , ( 'queue length: ' + i ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                rotateZ: '+=360',
                duration: duration,
                easing: easing
            })
            .done(function() {
                assert.ok( true , 'resolved: ' + i );
                $(this).next().hx( 'resolve' );
            });
        });

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    /*QUnit.module( '#break' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING,
        iterations: 3
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;
        var iterations = this.iterations;

        expect( $(SELECTOR).length + 1 );

        for (var i = 0; i < iterations; i++) {
            $(SELECTOR)
            .hx()
            [ method ]({
                type: 'transform',
                translate: {y: '+=50'},
                duration: duration,
                easing: easing,
                ref: '#break-main'
            });
        }

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( false , 'this should not be executed' );
        });

        async(function() {

            $(SELECTOR)
            .hx()
            .detach()
            .break();

            $(SELECTOR).each(function( i ) {
                assert.equal( this.$hx.queue.length , 1 , ( 'queue length: ' + i ));
            });

            $(SELECTOR).hx( 'done' , function() {
                assert.ok( true , 'done' );
                async(function() {
                    QUnit.start();
                });
            });
        });
    });*/

// ======================================== //

    /*QUnit.module( '#clear' , {
        method: 'iterate',
        duration: 800,
        easing: EASING,
        iterations: 1
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;
        var iterations = this.iterations;

        expect( $(SELECTOR).length + 1 );

        $(SELECTOR).on( 'hx.start' , function( e , data ) {
            console.log('start',data.ref);
        });

        for (var i = 0; i < iterations; i++) {
            $(SELECTOR)
            .hx()
            [ method ]([
                {
                    ref: function( element , i ) {
                        return element.className;
                    },
                    type: 'transform',
                    translate: {y: '+=100'},
                    duration: duration,
                    easing: easing
                },
                function( elapsed , progress ) {
                    console.log(progress[0]);
                }
            ]);
        }

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( false , 'this should not be executed' );
        });

        $(SELECTOR).on( 'hx.end' , function( e , data ) {
            console.log('end',data.ref);
        });

        async(function() {

            console.log('clear');
            $(SELECTOR)
            .hx()
            .detach();
            //.pause()
            //.clear();

            $(SELECTOR).each(function( i ) {
                assert.equal( this.$hx.queue.length , 0 , ( 'queue length: ' + i ));
            });
        }, 50);
    });*/

// ======================================== //

    /*QUnit.module( '#clear' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING,
        iterations: 3
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;
        var iterations = this.iterations;

        expect( $(SELECTOR).length + 1 );

        for (var i = 0; i < iterations; i++) {
            $(SELECTOR)
            .hx()
            [ method ]({
                type: 'transform',
                translate: {y: '+=50'},
                duration: duration,
                easing: easing,
                ref: '#clear-main'
            });
        }

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( false , 'this should not be executed' );
        });

        async(function() {

            $(SELECTOR)
            .hx()
            .detach()
            .clear();

            $(SELECTOR).each(function( i ) {
                assert.equal( this.$hx.queue.length , 0 , ( 'queue length: ' + i ));
            });

            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });*/

// ======================================== //

    QUnit.module( '#detach' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING
    });

    QUnit.asyncTest( 'done' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        expect( 1 );

        $(SELECTOR)
        .hx()
        [ method ]({
            type: 'transform',
            translate: {y: '+=50'},
            duration: duration,
            easing: easing,
            ref: '#detach-done'
        })
        .done(function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });

        async(function() {
            $(SELECTOR).hx( 'detach' );
        }, ( duration / 2 ));
    });

    QUnit.asyncTest( 'timing callbacks' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        var actual = [];
        var expected = [];
        var sampleIndex = Math.floor( Math.random() * $(SELECTOR).length );
        var n = 0;

        expect( 2 );

        $(SELECTOR)
        .hx()
        [ method ]([
            {
                type: 'transform',
                translate: {y: '+=50'},
                duration: duration,
                easing: easing,
                ref: '#detach-timing_callbacks'
            },
            function( elapsed , progress ) {
                if (n === sampleIndex) {
                    actual.push( elapsed );
                }
                n = ((n + 1) >= $(SELECTOR).length ? 0 : (n + 1));
            }
        ])
        .done(function() {

            assert.equal( actual.length , expected.length , 'timestamp array length' );
            assert.deepEqual( actual , expected , 'timestamp array deepEqual' );
            
            async(function() {
                QUnit.start();
            });
        });

        var unsubscribe = $.hx.subscribe(function( elapsed ) {
            expected.push( elapsed );
        });

        async(function() {
            $(SELECTOR).hx( 'detach' );
            unsubscribe();
        }, ( duration / 2 ));
    });

// ======================================== //

    QUnit.module( '#resolve' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING,
        iterations: 3
    });

    QUnit.asyncTest( 'promise' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;
        var iterations = this.iterations;
        var time;

        expect( iterations + 1 );

        for (var i = 0; i < iterations; i++) {

            $(SELECTOR)
            .hx()
            .then(function( resolve ) {
                async(function( elapsed ) {
                    time = elapsed;
                    $(SELECTOR).hx( 'resolve' );
                }, ( duration / 2 ));
                resolve();
            })
            .defer( duration * 2 )
            .then(function( resolve ) {
                var assertion = (time < duration);
                assert.ok( assertion , 'elapsed < duration' );
                resolve();
            })
            [ method ]({
                type: 'transform',
                translate: {y: '+=20'},
                duration: Math.ceil( duration / iterations ),
                easing: easing,
                ref: '#resolve-promise'
            });
        }

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });

    QUnit.asyncTest( 'animation' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;
        var iterations = this.iterations;
        var time, tcallback;
        var sampleIndex = Math.floor( Math.random() * $(SELECTOR).length );
        var n = 0;

        expect( iterations + 1 );

        for (var i = 0; i < iterations; i++) {
            
            $(SELECTOR)
            .hx()
            .then(function( resolve ) {
                async(function( elapsed ) {
                    time = elapsed;
                    $(SELECTOR)
                    .hx()
                    .detach()
                    .resolve( true );
                }, ( duration / 2 ));
                resolve();
            })
            [ method ]([
                {
                    type: 'transform',
                    translate: {y: '+=20'},
                    duration: duration,
                    easing: easing,
                    ref: '#resolve-animation'
                },
                function( elapsed ) {
                    if (n === sampleIndex) {
                        tcallback = elapsed;
                    }
                    n = ((n + 1) >= $(SELECTOR).length ? 0 : (n + 1));
                }
            ])
            .done(function() {
                assert.ok(( tcallback < time ) , 'timing callback < subscriber time' );
            });
        }

        $(SELECTOR).hx( 'done' , function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    QUnit.module( '#race' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        expect( 1 );

        $(SELECTOR)
        .hx()
        [ method ]({
            type: 'transform',
            translate: {y: '+=50'},
            duration: duration,
            easing: easing,
            delay: function() {
                return (Math.random() * duration);
            },
            ref: '#race-main'
        })
        .race(function() {
            assert.ok( true , 'done' );
            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    QUnit.module( '#done' , {
        method: METHOD,
        duration: DURATION,
        easing: EASING
    });

    QUnit.asyncTest( 'main' , function( assert ) {

        var method = this.method;
        var duration = this.duration;
        var easing = this.easing;

        var expectIndexes = $(SELECTOR).toArray().map(function( element , i ) {
            return i;
        });

        var actualIndexes = [];
        var timestamps = [];

        expect(( $(SELECTOR).length * 2 ) + 2 );

        $(SELECTOR)
        .hx()
        [ method ]({
            type: 'transform',
            translate: {y: '+=50'},
            duration: function( element , i ) {
                return (duration * (i + 1));
            },
            easing: easing,
            ref: '#done-main',
            done: function( element , i ) {
                timestamps[i] = performance.now();
                actualIndexes.push( i );
            }
        })
        .done(function() {

            timestamps[this.length] = performance.now();

            $(this).each(function( i ) {
                assert.equal( this.$hx.queue.length , 1 , ( 'queue length: ' + i ));
            });

            assert.equal( actualIndexes.length , expectIndexes.length , 'index array length' );
            assert.deepEqual( actualIndexes , expectIndexes , 'index array deepEqual' );

            timestamps.reduce(function( prev , current , i ) {
                var assertion = performance.polyfill ? (prev <= current) : (prev < current);
                assert.ok( assertion , ( 'timestamp: ' + i ));
                return current;
            });

            async(function() {
                QUnit.start();
            });
        });
    });

// ======================================== //

    function async( callback , delay ) {
        delay = delay || 20;
        var unsubscribe = $.hx.subscribe(function( elapsed ) {
            if (elapsed >= delay) {
                callback( elapsed );
                unsubscribe();
            }
        });
    }


}( QUnit ));






















