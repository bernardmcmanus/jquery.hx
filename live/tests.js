'use strict';

(function() {

    describe('Jquery', function() {
        it('should have hx', function() {
            expect($).to.have.property('hx');
        });
    });

    var ALL_SELECTOR = '.tgt0,.tgt1,.tgt2';

    var SKIP = [
        // 'should call done',
        // 'should execute in the right order',
        // 'should reset transition',
        // 'null transitions',
        // 'persistent transforms',
        // 'should reject',
        // 'should throw an error',
        // 'hx.start / hx.end',
        // 'hx.pause / hx.resume',
        // 'defineProperty'
    ]

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
            selector: '.tgt1',
            method: 'animate',
            duration: 200,
            easing: 'linear'
        },
        {
            selector: '.tgt1',
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
            duration: 0,
            easing: 'linear'
        },
        {
            selector: ALL_SELECTOR,
            method: 'iterate',
            duration: 0,
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

    function beforeEachAndEvery() {
        var color = [
            '#ff0000',
            '#00ff00',
            '#0000ff'
        ];
        for (var i = 0; i < 3; i++) {
            var target = $(document.createElement('div'));
            target.width(100).height(100).css('background-color', color[i]).css('margin', 50);
            target.addClass('tgt'+i);
            container.append(target)
        };
    }

    function afterEachAndEvery() {
        container.empty();
    }

    var container = $(document.createElement('div'));
    container.addClass('tgt-container');
    $('body').prepend(container);


// ================================================================================ //
//                                                                                  //
//                            /* PROMISE DIGESTION */                               //
//                                                                                  //
// ================================================================================ //

    describe('Promise Digestion', function() {

        this.timeout(0);

        // hard reset DOM
        beforeEach(beforeEachAndEvery);
        afterEach(afterEachAndEvery);

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'should call done';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                $(selector)
                .hx()
                [ method ]({
                    type: 'transform',
                    translate: {y: '+=20'},
                    duration: duration,
                    easing: easing
                })
                .done(function() {
                    done();
                });
    
            });
        });

// ================================================================================ //

        //  THIS ONE ISN'T PASSING FOR SOME REASON

        TEST_CASES.forEach(function( params ) {
            it ('should execute in the right order', function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                var spy = sinon.spy();

                var expectedOrder = [
                    [ 'translate3d' , 'scale3d' ],
                    [ 'scale3d' , 'translate3d' ],
                    [ 'translate3d' , 'rotateZ' ]
                ];

                $(selector)
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
                    spy();
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
                    spy();
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
                    spy();
                    resolve();
                })
                .done(function() {
                    expect(spy).to.have.callCount(3);
                    done();
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
                    expect(order).to.deep.equal(controlOrder);
                }
    
            });
        });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'should reset transition';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                $(selector)
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
                        expect(assertion).to.be.true;
                    });
                    resolve();
                })
                .done(function() {
                    done();
                });
    
            });
        });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'null transitions';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                var BCR = $(selector).toArray().map(function( element ) {
                    return element.getBoundingClientRect();
                });

                $(selector)
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
                        expect(test).to.deep.equal( bcr );
                    });
                    done();
                });
    
            });
        });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'persistent transforms';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;
                var sampleIndex = Math.floor( Math.random() * $(selector).length );

                var BCR = $(selector).toArray().map(function( element ) {
                    return element.getBoundingClientRect();
                });

                $(selector)
                .hx()
                [ method ]({
                    type: 'transform',
                    translate: {x: '+=20'},
                    duration: (duration / 4),
                    easing: easing
                })
                .then(function( resolve ) {
                    var t = this.get( 'translate' )[sampleIndex];
                    expect(t).to.deep.equal({x: 20, y: 0, z: 0});
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
                    expect(t).to.deep.equal({x: 20, y: 20, z: 0});
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
                    expect(t).to.deep.equal({x: 20, y: 20, z: 20});
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
                    expect(t).to.deep.equal({x: 10, y: 20, z: 20});
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
                    expect(t).to.deep.equal({x: 10, y: 10, z: 20});
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
                    expect(t).to.deep.equal({x: 10, y: 10, z: 10});
                    resolve();
                })
                .done(function() {
                    done();
                });
    
            });
        });

// ================================================================================ //


    });

// ================================================================================ //
//                                                                                  //
//                                  /* EVENTS */                                    //
//                                                                                  //
// ================================================================================ //

    describe('Events', function() {

        this.timeout(0);

        // hard reset DOM
        beforeEach(beforeEachAndEvery);
        afterEach(afterEachAndEvery);

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'should reject';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                var spy = sinon.spy();

                $(window).once( 'hx.reject' , function( e , args ) {
                    expect(e.namespace).to.equal('reject');
                    expect(args[0]).to.equal('test0');
                    expect(args[1]).to.equal('test1');
                });

                async(function() {
                    expect(spy).to.not.have.been.called;
                    done();
                }, 100)

                $(selector)
                .hx()
                .then(function( resolve , reject ) {
                    reject([ 'test0' , 'test1' ]);
                })
                .done(function() {
                    spy();
                });
    
            });
        });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'should throw an error';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                var spy = sinon.spy();

                var temp = $.hx.error;
                $.hx.error = function() {};

                $(window).once( 'hx.error' , function( e , data ) {
                    expect(e.namespace).to.equal('error');
                    expect( data instanceof Error ).to.be.ok;
                    spy('Good Spy');
                    $.hx.error = temp;
                });

                async(function() {
                    expect(spy).to.not.have.been.calledWith('Bad Spy');
                    expect(spy).to.have.been.calledWith('Good Spy');
                    done();
                }, duration);

                $(selector)
                .hx()
                .then(function( resolve , reject ) {
                    var a = null;
                    a.b = true;
                })
                .done(function() {
                    spy('Bad Spy');
                });
    
            });
        });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'hx.start / hx.end';
            if (SKIP.indexOf(msg) != -1)
                return;

            it (msg, function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                var spy = sinon.spy();

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

                $(selector)
                .hx()
                .then(function( resolve ) {

                    $(selector).once( 'hx.start' , function( e , data ) {
                        expect( e.namespace ).to.equal( 'start' );
                        expect( data.ref ).to.equal( '#hx.start' )
                        expect( data.bean ).to.deep.equal( bean0 );
                        spy();
                    });

                    resolve();
                })
                [ method ]( bean0 )
                .then(function( resolve ) {

                    $(selector).once( 'hx.end' , function( e , data ) {
                        expect( e.namespace ).to.equal( 'end' );
                        expect( data.ref ).to.equal( '#hx.end' );
                        expect( data.bean ).to.deep.equal( bean1 );
                        spy();
                    });

                    resolve();
                })
                [ method ]( bean1 )
                .done(function() {
                    expect(spy).to.have.been.calledTwice;
                    done();
                });
    
            });
        });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'hx.pause / hx.resume';
            if (SKIP.indexOf(msg) != -1)
                return;

            it ( msg , function ( done ) {
                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                if (method !== 'iterate' || duration === 0) {
                    done();
                    return;
                }

                var spy = sinon.spy();

                $(selector).once( 'hx.pause' , function( e , data ) {
                    expect( e.namespace ).to.equal( 'pause' );
                    expect( data.progress.length ).to.equal( 1 );
                    spy();
                });

                $(selector).once( 'hx.resume' , function( e , data ) {
                    expect( e.namespace ).to.equal( 'resume' );
                    expect( data.progress.length ).to.equal( 1 );
                    spy();
                });

                $(selector)
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
                    expect(spy).to.have.been.calledTwice;
                    done();
                });

                async(function() {
                    $(selector).hx( 'pause' );
                }, (duration / 2));

                async(function() {
                    $(selector).hx( 'resume' );
                }, (duration * 2));
    
            });
        });

// ================================================================================ //

    });

// ================================================================================ //
//                                                                                  //
//                                   /* #$hx */                                     //
//                                                                                  //
// ================================================================================ //

    describe('#$hx', function() {

        this.timeout(0);

        // hard reset DOM
        beforeEach(beforeEachAndEvery);
        afterEach(afterEachAndEvery);

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {

            var msg = 'defineProperty';
            if (SKIP.indexOf(msg) != -1)
                return;

            it ( msg , function () {

                var selector = params.selector;
                var method = params.method;
                var duration = params.duration;
                var easing = params.easing;

                var blur = hxManager.StyleDefinition.retrieve( 'blur' );

                expect( blur.name ).to.equal('blur');
                expect( blur.defaults ).to.deep.equal([ 0 ]);
                expect( blur.keymap ).to.deep.equal([ 0 ]);
                expect( blur.stringGetter ).to.equal( blurStringGetter );

                var dropShadow = hxManager.StyleDefinition.retrieve( 'drop-shadow' );

                expect( dropShadow.name ).to.equal( 'drop-shadow' );
                expect( dropShadow.pName ).to.equal( 'dropShadow' );
                expect( dropShadow.defaults ).to.deep.equal( [ 0 , 0 , 0 , 'transparent' ] );
                expect( dropShadow.keymap ).to.deep.equal([ 'x' , 'y' , 'blur' , 'color' ]);
                expect( dropShadow.stringGetter ).to.equal( dropShadowStringGetter );

                var clip = hxManager.StyleDefinition.retrieve( 'clip' );

                expect( clip.name ).to.equal( 'clip' );
                expect( clip.pName ).to.equal( 'clip' );
                expect( clip.defaults ).to.deep.equal( [ 0 , 0 , 0 , 0 ] );
                expect( clip.keymap ).to.deep.equal( [ 'top' , 'right' , 'bottom' , 'left' ] );
                expect( clip.stringGetter ).to.equal( clipStringGetter );
    
            });
        });

// ================================================================================ //

    });

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

})();























