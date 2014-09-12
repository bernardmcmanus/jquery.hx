(function() {


    Require.setManifestPath( 'http://bmcmanus.cs.sandbox.millennialmedia.com/jquery.hx/cdn/manifest.json' );
    Require.load( 'Solace' );


    $(document).on( 'hx.ready' , function() {

        $('#target').on( 'touchstart click' , function() {

            $(this).html( 'reset' );

            if (!QUnit.config.started) {
                QUnit.start();
            }
            else {
                window.location.reload( true );
            }
        });

        $('.clickable').on( 'touchstart mousedown' , function( e ) {
            e.preventDefault();
            if (this === e.target) {
                $(this).addClass( 'indicate' );
            }
        });

        $('.clickable').on( 'touchend mouseup' , function( e ) {
            e.preventDefault();
            if (this === e.target) {
                $('.indicate').removeClass( 'indicate' );
            }
        });
    });


    return;

    
    (function( selector ) {

        return;

        $(selector).on( 'hx.start' , function( e , data ) {
            console.log(e.namespace,data);
        });


        $(selector).on( 'hx.end' , function( e , data ) {
            console.log(e.namespace,data);
        });


        $(selector).on( 'hx.pause' , function( e , data ) {
            console.log(e.namespace,$.extend(true,{},data));
        });


        $(selector).on( 'hx.resume' , function( e , data ) {
            console.log(e.namespace,$.extend(true,{},data));
        });


        $(window).on( 'hx.error' , function( e , data ) {
            console.log(e.namespace,data);
        });


        $(window).on( 'hx.ready' , function( e , data ) {
            console.log(e.namespace,data);
        });

    }( '.tgt-container > div' ));


    (function() {

        /*$.hx.defineProperty( 'translateX' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'px)';
            });*/

        $.hx.defineProperty( 'blur' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'px)';
            });

        $.hx.defineProperty( 'brightness' )
            .set( 'defaults' , 100 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'contrast' )
            .set( 'defaults' , 100 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'dropshadow' , 'drop-shadow' )
            .set( 'defaults' , [ 0 , 0 , 0 , 'transparent' ])
            .set( 'keymap' , [ 'x' , 'y' , 'blur' , 'color' ])
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty.join( 'px ' ) + ')';
            });

        $.hx.defineProperty( 'grayscale' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'hueRotate' , 'hue-rotate' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + 'deg)';
            });

        $.hx.defineProperty( 'invert' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        /*$.hx.defineProperty( 'opacity' )
            .set( 'defaults' , 100 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });*/

        $.hx.defineProperty( 'saturate' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

        $.hx.defineProperty( 'sepia' )
            .set( 'defaults' , 0 )
            .set( 'stringGetter' , function( name , CSSProperty ) {
                return name + '(' + CSSProperty[0] + '%)';
            });

    }());


    // step test
    (function() {

        /*$.hx.defineProperty( 'top' )
            .setStringGetter(function( name , CSSProperty ) {
                return CSSProperty[0] + 'px';
            });

        $('.tgt').hx()
            .update({
                type: 'top',
                value: parseInt( $('.tgt').css( 'top' ) , 10 )
            })
            .defer( 1000 );

        bounce( 1 );

        function bounce( direction , count ) {

            count = count || 0;

            $('.tgt').hx()
                .iterate([
                    {
                        type: 'top',
                        value: ((direction > 0 ? '+=' : '-=') + '300'),
                        duration: 800,
                        easing: direction > 0 ? 'gravityDown' : 'gravityUp'
                    },
                    function( elapsed , progress ) {
                        //console.log(progress);
                    }
                ])
                .done(function() {
                    console.log(this.get());
                    direction *= -1;
                    count++;
                    if (count < 6) {
                        bounce( direction , count );
                    }
                });
        }*/



        /*var duration = 800;
        var distance = 400;
        var direction = 1;

        bounce(( distance * direction ) , 'gravityDown' , callback );

        function callback( easeName ) {
            direction *= -1;
            easeName = (easeName === 'gravityDown' ? 'gravityUp' : 'gravityDown');
            bounce(( distance * direction ) , easeName , callback );
        }

        function bounce( change , easeName , callback ) {

            var current = $('.tgt').position().top;
            var destination = current + change;
            var easing = hxManager.Bezier.retrieve( easeName );

            var unsubscribe = $.hx.subscribe(function( elapsed ) {

                var pct = elapsed / duration;
                var eased = easing.function( pct );

                if (pct >= 1) {
                    paint( 1 );
                    unsubscribe();
                    callback( easeName );
                }
                else {
                    paint( eased );
                }

                function paint( progress ) {
                    $('.tgt').css({
                        'top': current + ( progress * change ) + 'px'
                    });
                }
            });
        }*/

    }());


    function Main( e ) {
        e.preventDefault();
        tests.t3.s5();
    }


    var tests = {

        t1: function() {

            $('.tgt, .tgt2, .tgt3')

            .hx([
                {
                    type: 'transform',
                    translate: {x: '+=200'},
                    rotate: {x: 1, y: 1, z: 1, a: 360},
                    scale: {x: '+=0.2', y: '+=0.2', z: '+=0.2'},
                    duration: 800,
                    easing: 'easeOutBack',
                    done: function() {
                        console.log('transform 1 complete');
                    }
                },
                {
                    type: 'opacity',
                    value: 0.3,
                    duration: 1000,
                    done: function() {
                        console.log('opacity 1 complete');
                    }
                },
                {
                    type: 'opacity',
                    value: 1,
                    duration: 400,
                    done: function() {
                        console.log('opacity 2 complete');
                    }
                }
            ])

            .then(function( resolve , reject ) {
                console.log('cool');
                resolve();
            })

            .hx({
                type: 'transform',
                translate: {x: '-=200'},
                rotate: null,
                scale: {x: '-=0.2', y: '-=0.2', z: '-=0.2'},
                duration: 1000,
                delay: 1000,
                easing: 'easeOutBack',
                done: function() {
                    console.log('transform 2 complete');
                }
            })

            .hx([
                {
                    type: 'transform',
                    rotateZ: 360,
                    duration: 1200,
                    easing: 'easeOutBack',
                    done: function() {
                        console.log('transform 3 complete');
                    }
                },
                {
                    type: 'background-color',
                    value: '#fff',
                    duration: 1200
                }
            ])

            .hx([
                {
                    type: 'transform',
                    rotateZ: 0,
                    duration: 1200,
                    easing: 'easeOutBack',
                    done: function() {
                        console.log('transform 4 complete');
                    }
                },
                {
                    type: 'background-color',
                    value: '',
                    duration: 1200
                }
            ])

            .done(function() {
                console.log('awesome');
            });
        },

        // test - zero duration
        t7: function() {

            var start, move, diff, origin, target;
            var selector = '.tgt, .tgt2, .tgt3';

            function reset() {
                start = {};
                move = {now:{},last:{}};
                diff = {total:{},inst:{}};
                origin = $(target).hx( 'get' , 'translate' )[0];
            }

            function coolStart( e ) {

                e = e.originalEvent;

                target = this;
                reset();

                start.x = e.touches[0].clientX;
                start.y = e.touches[0].clientY;

                $(window).on( 'touchmove' , coolMove );
                $(window).on( 'touchend' , coolEnd );
            }

            function coolMove( e ) {

                e.preventDefault();
                e = e.originalEvent;

                move.last.x = move.now.x || start.x;
                move.last.y = move.now.y || start.y;

                move.now.x = e.touches[0].clientX;
                move.now.y = e.touches[0].clientY;

                diff.total.x = move.now.x - start.x;
                diff.total.y = move.now.y - start.y;

                var x = origin.x + diff.total.x;
                var y = origin.y + diff.total.y;

                $(target).hx( 'zero' , [
                    /*{
                        type: 'opacity',
                        value: ('+=' + ((x - y)/100))
                    },*/
                    {
                        type: 'transform',
                        translate: {
                            x: x,
                            y: y
                        },
                        /*scale: {
                            x: ((x / 100) >= 1 ? (x / 100) : 1),
                            y: ((y / 100) >= 1 ? (y / 100) : 1)
                        },*/
                        order: [ 'translate' , 'scale' ]
                    }
                ]);
            }

            function coolEnd( e ) {
                $(window).off( 'touchmove' , coolMove );
                $(window).off( 'touchend' , coolEnd );
                console.log($(target).hx( 'get' ));
            }

            $(selector).on( 'touchstart' , coolStart );
        },



        // test - pause / resume on non-precision pods
        t15: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            //var selector = '.tgt';
            var duration = 400;

            function bounce( initial ) {

                $(selector).each(function( i ) {

                    $(this)
                    .hx( 'iterate' , {
                        type: 'transform',
                        translate: ($(this).hasClass( 'reverse' ) ? null : {y: '+=300'}),
                        duration: duration,
                        delay: (initial ? (i * 50) : 0),
                        easing: ($(this).hasClass( 'reverse' ) ? 'gravityUp' : 'gravityDown')
                    })
                    .then(function( resolve ) {
                        resolve();
                    })
                    .then(function( resolve ) {
                        resolve();
                    })
                    .then(function( resolve ) {
                        resolve();
                    })
                    .done( bounce );

                    $(this).toggleClass( 'reverse' );
                });
            }

            bounce( true );
            toggleAction();

            $(selector).get( 0 )._hx.getCurrentPod().when( 'podComplete' , pause );

            function toggleAction( current ) {
                var action = (current === pause ? resume : pause);
                $('#target')
                .html( action.name )
                .off( 'touchstart click' )
                .on( 'touchstart click' , action );
            }

            function pause( e ) {
                if (e) {
                    e.preventDefault();
                }
                $(selector).hx( 'pause' );
                toggleAction( pause );
            }

            function resume( e ) {
                if (e) {
                    e.preventDefault();
                }
                $(selector).hx( 'resume' );
                toggleAction( resume );
            }
        },

        // test - delay function
        t19: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            var duration = 600;
            var targetCount = 9;

            function count() {
                return $(selector).length;
            }

            while (count() < targetCount) {
                $('.tgt-container').append(
                    $(selector).slice( 0 , 3 ).clone( true )
                );
            }

            init();

            $(selector).hx([
                {
                    type: 'transform',
                    translate: {y: '+=100'},
                    scale: null,
                    duration: duration,
                    delay: function( element , i ) {
                        return (count() - i) * 100;
                    }
                },
                {
                    type: 'background-color',
                    value: null,
                    duration: duration,
                    delay: function( element , i ) {
                        return (count() - i) * 100;
                    }
                },
                /*function( time , progress ) {
                    console.log(progress);
                }*/
            ]);

            $(selector).hx( 'then' , function( resolve ) {
                resolve();
            })
            .hx([
                {
                    type: 'transform',
                    translate: function( element , i ) {
                        return {
                            x: ('-=' + (24 * (i % 3))),
                            y: ('-=' + (24 * Math.floor(i / 3)))
                        };
                    },
                    duration: duration
                },
                {
                    type: 'background-color',
                    value: '#808080',
                    duration: duration
                }
            ]);

            function init() {
                $('.tgt-container').find( 'div' )
                .hx({
                    type: 'opacity',
                    value: 0
                })
                .then(function( resolve ) {

                    $(this)
                    .hx( 'update' , [
                        {
                            type: 'transform',
                            translate: function( element , i ) {
                                return {
                                    x: ((i % 3) * 14 + 4),
                                    y: (Math.floor(i / 3) * 14 + 14)
                                };
                            },
                            scale: {x: 1.3, y: 1.3}
                        },
                        {
                            type: 'background-color',
                            value: '#808080'
                        }
                    ])
                    .paint();

                    resolve();
                })
                .hx({
                    type: 'opacity',
                    value: null
                });
            }
        },

        // test - bean done function
        t20: function() {

            var selector = '.tgt';

            $(selector).hx()
            .iterate({
                type: 'transform',
                translate: {y: '+=200'},
                duration: 800,
                done: function() {
                    console.log('bean done');
                    console.log($(selector).hx( 'get' , 'transform' , 'translate' )[0]);
                    console.log($(selector).css( '-webkit-transition' ));
                }
            })
            .animate([
                {
                    type: 'transform',
                    translate: {y: '+=100'},
                    done: function() {
                        console.log('bean done');
                        console.log($(selector).hx( 'get' , 'transform' , 'translate' )[0]);
                        console.log($(selector).css( '-webkit-transition' ));
                    }
                },
                {
                    type: 'transform',
                    translate: {y: '+=100'},
                    done: function() {
                        console.log('bean done');
                        console.log($(selector).hx( 'get' , 'transform' , 'translate' )[0]);
                        console.log($(selector).css( '-webkit-transition' ));
                    }
                }
            ])
            .done(function() {
                console.log('pod done');
                console.log($(selector).hx( 'get' , 'transform' , 'translate' )[0]);
                console.log($(selector).css( '-webkit-transition' ));
            });
        }
    };

}());






















