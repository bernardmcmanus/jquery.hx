'use strict';

(function() {

    describe('Jquery', function() {
        it('should have hx', function() {
            expect($).to.have.property('hx');
        });
    });

    var ALL_SELECTOR = '.tgt0,.tgt1,.tgt2';

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

    var container = $(document.createElement('div'));
    container.addClass('tgt-container');
    $('body').prepend(container);

    describe('Promise Digestion', function() {

        this.timeout(0);

        // hard reset DOM
        beforeEach(function() {
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
        })

        afterEach(function() {
            container.empty();
        })

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {
            it ('should call done', function ( done ) {
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

        // TEST_CASES.forEach(function( params ) {
        //     it ('should execute in the right order', function ( done ) {
        //         var selector = params.selector;
        //         var method = params.method;
        //         var duration = params.duration;
        //         var easing = params.easing;

        //         var spy = sinon.spy();

        //         var expectedOrder = [
        //             [ 'translate3d' , 'scale3d' ],
        //             [ 'scale3d' , 'translate3d' ],
        //             [ 'translate3d' , 'rotateZ' ]
        //         ];

        //         $(selector)
        //         .hx()
        //         [ method ]({
        //             type: 'transform',
        //             translate: {y: '+=50'},
        //             scale: {x: '+=0.5', y: '+=0.5'},
        //             duration: duration,
        //             easing: easing
        //         })
        //         .then(function( resolve ) {
        //             checkOrder( this , 0 );
        //             spy();
        //             resolve();
        //         })
        //         [ method ]({
        //             type: 'transform',
        //             scale: {x: '+=0.5', y: '+=0.5'},
        //             order: [ 'scale' , 'translate' ],
        //             duration: duration,
        //             easing: easing
        //         })
        //         .then(function( resolve ) {
        //             checkOrder( this , 1 );
        //             spy();
        //             resolve();
        //         })
        //         [ method ]({
        //             type: 'transform',
        //             scale: null,
        //             translate: {y: '+=50'},
        //             rotateZ: '+=90',
        //             duration: duration,
        //             easing: easing
        //         })
        //         .then(function( resolve ) {
        //             checkOrder( this , 2 );
        //             spy();
        //             resolve();
        //         })
        //         .done(function() {
        //             expect(spy).to.have.callCount(3);
        //             done();
        //         });

        //         function checkOrder( context , i ) {
        //             var expected = expectedOrder.shift();
        //             var order = [], controlOrder = [];
        //             $(context).each(function() {
        //                 order = order.concat(
        //                     this.$hx.componentMOJO.order.transform
        //                 );
        //                 controlOrder = controlOrder.concat( expected );
        //             });
        //             expect(order).to.equal(controlOrder);    < --------------- This right here
        //         }
    
        //     });
        // });

// ================================================================================ //

        TEST_CASES.forEach(function( params ) {
            it ('should reset transition', function ( done ) {
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
            it ('null transitions', function ( done ) {
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
            it ('persistent transforms', function ( done ) {
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


})();























