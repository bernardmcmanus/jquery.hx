(function( window , navigator , document , $ , QUnit ) {

// ================================================================================ //

    QUnit.config.altertitle = false;
    QUnit.config.autostart = false;
    QUnit.config.hidepassed = true;
    QUnit.config.reorder = false;
    QUnit.config.scrolltop = false;

// ================================================================================ //

    var ALL_SELECTOR = '.tgt,.tgt2,.tgt3';

    var TEST_CASES = [
        {
            selector: ALL_SELECTOR,
            method: 'animate',
            duration: 400,
            easing: 'easeOutBack'
        },
        {
            selector: ALL_SELECTOR,
            method: 'iterate',
            duration: 400,
            easing: 'easeOutBack'
        },
        {
            selector: '.tgt2',
            method: 'animate',
            duration: 200,
            easing: 'linear'
        },
        {
            selector: '.tgt2',
            method: 'iterate',
            duration: 200,
            easing: 'linear'
        },
        {
            selector: ALL_SELECTOR,
            method: 'animate',
            duration: 50,
            easing: 'linear'
        },
        {
            selector: ALL_SELECTOR,
            method: 'iterate',
            duration: 50,
            easing: 'linear'
        },
        {
            selector: ALL_SELECTOR,
            method: 'animate',
            duration: 300,
            easing: [ 0.25 , 0.1 , 0.25 , 1 ]
        },
        {
            selector: ALL_SELECTOR,
            method: 'iterate',
            duration: 300,
            easing: [ 0.25 , 0.1 , 0.25 , 1 ]
        }
    ];

// ================================================================================ //

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

// ================================================================================ //

    QUnit.testDone(function( details ) {
        $(ALL_SELECTOR).each(function() {
            var clone = $(this).clone( true );
            clone.attr( 'style' , '' );
            $(this).replaceWith( clone );
        });
    });

// ================================================================================ //

    TEST_CASES.forEach(function( params ) {

        var SELECTOR = params.selector;
        var METHOD = params.method;
        var DURATION = params.duration;
        var EASING = params.easing;

// ================================================================================ //

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

        QUnit.asyncTest( 'null transitions' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;

            var BCR = $(SELECTOR).toArray().map(function( element ) {
                return element.getBoundingClientRect();
            });

            expect( BCR.length );

            $(SELECTOR)
            .hx()
            [ method ]({
                type: 'transform',
                translate: {y: '+=50'},
                scale: {x: '+=0.5', y: '+=0.5'},
                duration: duration,
                easing: easing
            })
            [ method ]({
                type: 'transform',
                translate: null,
                scale: null,
                duration: 0
            })
            .done(function() {

                var that = this;

                BCR.forEach(function( bcr , i ) {
                    var test = that[i].getBoundingClientRect();
                    assert.deepEqual( test , bcr , JSON.stringify( test ));
                });

                async(function() {
                    QUnit.start();
                });
            });
        });

        QUnit.asyncTest( 'persistent transforms' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;
            var sampleIndex = Math.floor( Math.random() * $(SELECTOR).length );

            expect( 7 );

            $(SELECTOR)
            .hx()
            [ method ]({
                type: 'transform',
                translate: {x: '+=20'},
                duration: (duration / 4),
                easing: easing
            })
            .then(function( resolve ) {
                var t = this.get( 'translate' )[sampleIndex];
                assert.deepEqual( t , {x: 20, y: 0, z: 0} , JSON.stringify( t ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                translate: {y: '+=20'},
                duration: (duration / 4),
                easing: easing
            })
            .then(function( resolve ) {
                var t = this.get( 'translate' )[sampleIndex];
                assert.deepEqual( t , {x: 20, y: 20, z: 0} , JSON.stringify( t ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                translate: {z: '+=20'},
                duration: (duration / 4),
                easing: easing
            })
            .then(function( resolve ) {
                var t = this.get( 'translate' )[sampleIndex];
                assert.deepEqual( t , {x: 20, y: 20, z: 20} , JSON.stringify( t ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                translate: {x: 10},
                duration: (duration / 4),
                easing: easing
            })
            .then(function( resolve ) {
                var t = this.get( 'translate' )[sampleIndex];
                assert.deepEqual( t , {x: 10, y: 20, z: 20} , JSON.stringify( t ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                translate: {y: 10},
                duration: (duration / 4),
                easing: easing
            })
            .then(function( resolve ) {
                var t = this.get( 'translate' )[sampleIndex];
                assert.deepEqual( t , {x: 10, y: 10, z: 20} , JSON.stringify( t ));
                resolve();
            })
            [ method ]({
                type: 'transform',
                translate: {z: 10},
                duration: (duration / 4),
                easing: easing
            })
            .then(function( resolve ) {
                var t = this.get( 'translate' )[sampleIndex];
                assert.deepEqual( t , {x: 10, y: 10, z: 10} , JSON.stringify( t ));
                resolve();
            })
            .done(function() {
                assert.ok( true , 'ok' );
                async(function() {
                    QUnit.start();
                });
            });
        });

// ================================================================================ //

        QUnit.module( 'events' , {
            method: METHOD,
            duration: DURATION,
            easing: EASING
        });

        QUnit.asyncTest( 'hx.reject' , function( assert ) {

            expect( 3 );

            $(window).once( 'hx.reject' , function( e , args ) {
                assert.equal( e.namespace , 'reject' , 'event' );
                assert.equal( args[0] , 'test0' , 'args[0]' );
                assert.equal( args[1] , 'test1' , 'args[1]' );
                async(function() {                
                    QUnit.start();
                });
            });

            $(SELECTOR)
            .hx()
            .then(function( resolve , reject ) {
                reject([ 'test0' , 'test1' ]);
            })
            .done(function() {
                assert.ok( false , 'this should not be executed' );
            });
        });

        QUnit.asyncTest( 'hx.error' , function( assert ) {

            expect( 2 );

            var temp = $.hx.error;
            $.hx.error = function() {};

            $(window).once( 'hx.error' , function( e , data ) {
                assert.equal( e.namespace , 'error' , 'event' );
                assert.ok(( data instanceof Error ) , 'data' );
                $.hx.error = temp;
                async(function() {                
                    QUnit.start();
                });
            });

            $(SELECTOR)
            .hx()
            .then(function() {
                var a = null;
                a.b = true;
            })
            .done(function() {
                assert.ok( false , 'this should not be executed' );
            });
        });

        QUnit.asyncTest( 'hx.start / hx.end' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;

            expect( 6 );

            var bean0 = {
                type: 'transform',
                translate: {y: '+=20'},
                duration: function( element , i ) {
                    return (( duration * ( i + 1 )) / 2 );
                },
                easing: easing,
                ref: '#hx.start'
            };

            var bean1 = {
                type: 'transform',
                translate: {y: '-=20'},
                duration: duration,
                easing: easing,
                ref: '#hx.end'
            };

            $(SELECTOR)
            .hx()
            .then(function( resolve ) {

                $(SELECTOR).once( 'hx.start' , function( e , data ) {
                    assert.equal( e.namespace , 'start' , 'start: event' );
                    assert.equal( data.ref , '#hx.start' , 'start: data.ref' );
                    assert.deepEqual( data.bean , bean0 , 'start: data.bean' );
                });

                resolve();
            })
            [ method ]( bean0 )
            .then(function( resolve ) {

                $(SELECTOR).once( 'hx.end' , function( e , data ) {
                    assert.equal( e.namespace , 'end' , 'end: event' );
                    assert.equal( data.ref , '#hx.end' , 'end: data.ref' );
                    assert.deepEqual( data.bean , bean1 , 'end: data.bean' );
                });

                resolve();
            })
            [ method ]( bean1 )
            .done(function() {
                async(function() {
                    QUnit.start();
                });
            });
        });

        QUnit.asyncTest( 'hx.pause / hx.resume' , function( assert ) {

            var method = this.method;

            if (method !== 'iterate') {
                expect( 1 );
                assert.ok( true , 'this test only applies to iterate' );
                QUnit.start();
                return;
            }

            var duration = this.duration;
            var easing = this.easing;

            expect( 4 );

            $(SELECTOR).once( 'hx.pause' , function( e , data ) {
                assert.equal( e.namespace , 'pause' , 'pause: event' );
                assert.ok(( data.progress.length === 1 ) , 'pause: progress' );
            });

            $(SELECTOR).once( 'hx.resume' , function( e , data ) {
                assert.equal( e.namespace , 'resume' , 'resume: event' );
                assert.ok(( data.progress.length === 1 ) , 'resume: progress' );
            });

            $(SELECTOR)
            .hx()
            [ method ]({
                type: 'transform',
                translate: {y: '+=50'},
                duration: function( element , i ) {
                    return (( duration * ( i + 1 )) / 2 );
                },
                easing: easing
            })
            .done(function() {
                async(function() {
                    QUnit.start();
                });
            });

            async(function() {
                $(SELECTOR).hx( 'pause' );
            }, (duration / 2));

            async(function() {
                $(SELECTOR).hx( 'resume' );
            }, (duration * 2));
        });

// ================================================================================ //

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

// ================================================================================ //

        QUnit.module( '#then' , {
            method: METHOD,
            duration: DURATION,
            easing: EASING
        });

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

        QUnit.asyncTest( 'aggregate' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;

            expect( $(SELECTOR).length + 1 );

            $(SELECTOR)
            .hx()
            [ method ]([
                {
                    type: 'opacity',
                    value: 0.5,
                    duration: duration,
                    delay: function( element , i ) {
                        return (duration * i);
                    },
                    easing: easing
                },
                {
                    type: 'transform',
                    translate: {y: 40},
                    rotateZ: 360,
                    duration: duration,
                    delay: function( element , i ) {
                        return (duration * i);
                    },
                    easing: easing
                }
            ])
            .then(function( resolve ) {
                this.each(function( i ) {
                    assert.equal( this.$hx.queue.length , 3 , ( 'queue length ' + i ));
                });
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
                }
            ])
            .done(function() {
                assert.ok( true , 'done' );
                async(function() {
                    QUnit.start();
                });
            });
        });

// ================================================================================ //

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
                    value: 0.5
                },
                {
                    type: 'filter',
                    blur: 2,
                    dropShadow: {x: 10, y: 10, color: 'blue'}
                },
                {
                    type: 'clip',
                    value: {
                        top: 0,
                        right: 25,
                        bottom: 25,
                        left: 0
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

// ================================================================================ //

        QUnit.module( '#paint' , {
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
                    value: 0.5
                },
                {
                    type: 'filter',
                    blur: 2,
                    dropShadow: {x: 10, y: 10, color: 'blue'}
                },
                {
                    type: 'clip',
                    value: {
                        top: 0,
                        right: 25,
                        bottom: 25,
                        left: 0
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

                var style = $(SELECTOR).attr( 'style' );
                var prefixed = hxManager.VendorPatch.prefix( type );
                var re = new RegExp( '(' + prefixed + '|' + type + ')' );
                var assertion = re.test( style );

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
                var re = new RegExp( '(' + prefixed + '|' + type + ')' );
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

                var style = $(SELECTOR).attr( 'style' );
                var prefixed = hxManager.VendorPatch.prefix( type );
                var re = new RegExp( '(' + prefixed + '|' + type + ')' );
                var assertion = re.test( style );

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

// ================================================================================ //

        QUnit.module( '#reset' , {
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
                    value: 0.5
                },
                {
                    type: 'filter',
                    blur: 2,
                    dropShadow: {x: 10, y: 10, color: 'blue'}
                },
                {
                    type: 'clip',
                    value: {
                        top: 0,
                        right: 25,
                        bottom: 25,
                        left: 0
                    }
                }
            ]
        });

        QUnit.asyncTest( 'main' , function( assert ) {

            var beans = this.beans;
            var initStyle = $(SELECTOR).attr( 'style' );

            expect( beans.length + 1 );

            beans.forEach(function( bean ) {

                $(SELECTOR)
                .hx()
                .update( bean )
                .reset()
                .paint();

                var style = $(SELECTOR).attr( 'style' );
                assert.equal( style , initStyle , bean.type );
            });

            async(function() {
                assert.ok( true , 'ok' );
                async(function() {
                    QUnit.start();
                });
            });
        });

// ================================================================================ //

        QUnit.module( '#get' , {
            method: METHOD,
            duration: DURATION,
            easing: EASING
        });

        QUnit.asyncTest( 'main' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;

            var Expected = [];
            var sampleIndex = Math.floor( Math.random() * $(SELECTOR).length );
            var target = $(SELECTOR).get( sampleIndex );

            Expected.push({
                opacity: 0.8,
                rotateZ: 45,
                translate: { x: 0, y: 135, z: 0 },
                blur: 10,
                dropShadow: { x: 10, y: 10, blur: 0, color: '#512eff' },
                clip: {
                    left: 0,
                    top: 0,
                    right: $(target).width(),
                    bottom: $(target).height()
                }
            });

            Expected.push({
                opacity: 1,
                rotateZ: 0,
                translate: { x: 0, y: 0, z: 0 },
                blur: 0,
                dropShadow: { x: 0, y: 0, blur: 0, color: 'transparent' },
                clip: { left: 0, top: 0, right: 0, bottom: 0 }
            });

            var count = Expected.reduce(function( prev , current ) {
                return prev + Object.keys( current ).length;
            }, 0);

            expect( count + 1 );

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
                    dropShadow: {x: 10, y: 10, color: '#512eff'}
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

                Object.keys( expected ).forEach(function( key ) {
                    var expval = expected[key];
                    var stored = $(target).hx( 'get' , key )[0];
                    assert.deepEqual( stored , expval , ( key + ' = ' + stringify( expval )));
                });
            }

            function stringify( expected ) {
                return typeof expected === 'object' ? JSON.stringify( expected ) : expected;
            }
        });

// ================================================================================ //

        QUnit.module( '#defer' , {
            method: METHOD,
            duration: DURATION,
            easing: EASING
        });

        QUnit.asyncTest( 'timed' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;

            if (!duration) {
                expect( 1 );
                assert.ok( true , 'this test requires duration > 0' );
                QUnit.start();
                return;
            }

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
                    var that = this;
                    assert.ok( true , 'resolved: ' + i );
                    $(that).next().hx( 'resolve' );
                });
            });

            $(SELECTOR).hx( 'done' , function() {
                assert.ok( true , 'done' );
                async(function() {
                    QUnit.start();
                });
            });
        });

// ================================================================================ //

        QUnit.module( '#break' , {
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
        });

// ================================================================================ //

        QUnit.module( '#clear' , {
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
        });

// ================================================================================ //

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

// ================================================================================ //

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

        QUnit.asyncTest( 'paused' , function( assert ) {

            var method = this.method;

            if (method !== 'iterate') {
                expect( 1 );
                assert.ok( true , 'this test only applies to iterate' );
                QUnit.start();
                return;
            }

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
                        .pause()
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
                        ref: '#resolve-paused'
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

        QUnit.asyncTest( 'bean_done' , function( assert ) {

            var method = this.method;
            var duration = this.duration;
            var easing = this.easing;
            var iterations = this.iterations;

            expect( 1 );

            for (var i = 0; i < iterations; i++) {
                
                $(SELECTOR)
                .hx()
                .then(function( resolve ) {
                    async(function( elapsed ) {
                        $(SELECTOR).hx( 'resolve' , true );
                    }, ( duration / 2 ));
                    resolve();
                })
                [ method ]({
                    type: 'transform',
                    translate: {y: '+=20'},
                    duration: duration,
                    easing: easing,
                    ref: '#resolve-bean_done',
                    done: function() {
                        assert.ok( false , 'this should not be executed' );
                    }
                });
            }

            $(SELECTOR).hx( 'done' , function() {
                assert.ok( true , 'done' );
                async(function() {
                    QUnit.start();
                });
            });
        });

// ================================================================================ //

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

// ================================================================================ //

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

    });

// ================================================================================ //

    function async( callback , delay ) {
        delay = delay || 30;
        var unsubscribe = $.hx.subscribe(function( elapsed ) {
            if (elapsed >= delay) {
                callback( elapsed );
                unsubscribe();
            }
        });
        return unsubscribe;
    }


}( window , navigator , document , jQuery , QUnit ));






















