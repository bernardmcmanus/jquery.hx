(function() {


    $('#target').on( 'click' , function() {

        $(this).html( 'reset' );

        if (!QUnit.config.started) {
            QUnit.start();
        }
        else {
            window.location.reload();
        }
        
        /*var method = 'animate';

        $('.tgt')
        .hx( method , [
            {
                type: 'transform',
                scale: {x: 1.5, y: 1.5},
                duration: 1200
            },
            function( elapsed , progress , detach ) {
                console.log(progress);
            },
            function( elapsed , progress , detach ) {
                if (progress[0] >= 0.5) {
                    //$(this).hx( 'break' );
                    $(this).hx( 'resolve' , true );
                    console.log( '------------------------' );
                    detach( true );
                }
            }
        ])
        .hx( method , [
            {
                type: 'transform',
                scale: null,
                duration: 1200
            },
            function( elapsed , progress , detach ) {
                console.log(progress);
            }
        ])
        .done(function() {
            console.log('done');
            console.log(this[0].$hx);
        });*/
    });


    /*$('.tgt').hx( 'zero' , {
        type: 'opacity',
        value: 0
    });


    $('#target').on( 'click' , function() {

        var method = 'animate';

        $('.tgt')
        .hx( method , {
            type: 'opacity',
            value: 1,
            duration: 800,
            delay: 200
        })
        .hx( method , {
            type: 'opacity',
            value: 0,
            duration: 1200,
            delay: 1200
        })
        .done(function() {
            console.log('done');
        });
    });*/

    /*$('.tgt').hx()
    .animate([
        {
            type: 'opacity',
            value: '-=0.5',
            duration: 2000,
            easing: 'linear',
            delay: 1000
        },
        {
            type: "transform",
            translate: {x: '+=200'},
            duration: 1000,
            easing: 'linear',
            delay: 1000
        },
        {
            type: "transform",
            translate: {y: '+=200'},
            duration: 1000,
            easing: 'linear'
        }
    ])
    .done(function() {
        console.log('done');
    });

    $('#target').on( 'click' , function() {
        $('.tgt').hx().clear();
    });*/

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


    $(document).on( 'hx.ready' , function() {

        $('#target').on( 'touchstart click' , Main );

        $('div').on( 'touchstart mousedown' , function( e ) {
            e.preventDefault();
            if (this === e.target) {
                $(this).addClass( 'indicate' );
            }
        });

        $('div').on( 'touchend mouseup' , function( e ) {
            e.preventDefault();
            if (this === e.target) {
                $('.indicate').removeClass( 'indicate' );
            }
        });
    });


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

        t3: {

            

            // test - resolve
            s5: function() {

                //var method = 'iterate';
                var method = 'animate';
                var incrementor = '+=360';
                var order = [ '.tgt' , '.tgt2' , '.tgt3' ];
                var current = null;

                $('#target')
                .off( 'touchstart click' )
                .on( 'touchstart click' , function() {
                    if (current) {
                        if (method === 'iterate') {
                            $(current).hx().pause();
                        }
                        $(current).hx().resolve( true );
                    }
                });

                $(order[0])
                .hx( 'then' , function( resolve ) {
                    current = this[0];
                    resolve();
                })
                .hx( method , [
                    {
                        type: 'opacity',
                        value: '-=0.3',
                        done: function() {
                            console.log('done 0-opacity');
                        }
                    },
                    {
                        type: 'transform',
                        rotateZ: incrementor,
                        duration: 1200,
                        easing: 'easeOutBack',
                        done: function() {
                            console.log('done 0-transform-0');
                        }
                    },
                    {
                        type: 'transform',
                        translate: {x: '+=100'},
                        order: [ 'translate' , 'rotateZ' ],
                        delay: (method === 'iterate' ? 400 : 0),
                        done: function() {
                            console.log('done 0-transform-1');
                        }
                    },
                    function( elapsed , progress ) {
                        /*progress = progress.map(function( pct ) {
                            return Math.round( pct * 1000 ) / 1000;
                        });
                        console.log(progress);*/
                    }
                ])
                .then(function( resolve ) {
                    console.log('.order[0] next');
                    //console.log(this[0]._hx);
                    resolve();
                })
                .done(function() {
                    $(order[1]).hx( 'resolve' );
                });

                $(order[1])
                .hx( 'defer' )
                .then(function( resolve ) {
                    current = this[0];
                    resolve();
                })
                .hx( method , [
                    {
                        type: 'opacity',
                        value: '-=0.3',
                        done: function() {
                            console.log('done 1-opacity');
                        }
                    },
                    {
                        type: 'transform',
                        rotateZ: incrementor,
                        duration: 1200,
                        easing: 'easeOutBack',
                        done: function() {
                            console.log('done 1-transform-0');
                        }
                    },
                    {
                        type: 'transform',
                        translate: {x: '+=100'},
                        order: [ 'translate' , 'rotateZ' ],
                        delay: (method === 'iterate' ? 400 : 0),
                        done: function() {
                            console.log('done 1-transform-1');
                        }
                    }
                ])
                .then(function( resolve ) {
                    console.log('.order[1] next');
                    //console.log(this[0]._hx);
                    resolve();
                })
                .done(function() {
                    $(order[2]).hx( 'resolve' );
                });

                $(order[2])
                .hx( 'defer' )
                .then(function( resolve ) {
                    current = this[0];
                    resolve();
                })
                .hx( method , [
                    {
                        type: 'opacity',
                        value: '-=0.3',
                        done: function() {
                            console.log('done 2-opacity');
                        }
                    },
                    {
                        type: 'transform',
                        rotateZ: incrementor,
                        duration: 1200,
                        easing: 'easeOutBack',
                        done: function() {
                            console.log('done 2-transform-0');
                        }
                    },
                    {
                        type: 'transform',
                        translate: {x: '+=100'},
                        order: [ 'translate' , 'rotateZ' ],
                        delay: (method === 'iterate' ? 400 : 0),
                        done: function() {
                            console.log('done 2-transform-1');
                        }
                    }
                ])
                .then(function( resolve ) {
                    console.log('.order[2] next');
                    //console.log(this[0]._hx);
                    resolve();
                })
                .done(function() {
                    current = null;
                    $('#target')
                    .off( 'touchstart click' )
                    .on( 'touchstart click' , Main );
                    console.log('done all');
                });
            },
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

        // test - persistent transforms
        t8: function() {

            var selector = '.tgt,.tgt2,.tgt3';

            if (!$(selector).hasClass( 'click1' )) {
                $(selector).hx({
                    type: 'transform',
                    translate: {x: '+=100'}
                });
                $(selector).addClass( 'click1' );
            }
            else {
                $(selector).hx({
                    type: 'transform',
                    translate: {y: '+=100'}
                });
                $(selector).removeClass( 'click1' );
            }
        },

        // test - null transitions
        t9: function() {

            var selector = '.tgt';

            $(selector).hx({
                type: 'transform',
                translate: {y: '+=300'},
                duration: 800
            });

            setTimeout(function() {

                $(selector)
                .hx( 'clear' )
                .hx({
                    type: 'transform',
                    translate: {y: 0},
                    duration: 0
                });

            }, 400 );
        },

        // test - update component
        t10: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            var rand = Math.round(Math.random() * 100);

            $(selector)
            .hx({
                type: 'transform',
                translate: {x: ('+=' + rand), y: ('+=' + rand)}
            })
            .update({
                type: 'transform',
                translate: {x: 100, y: 100}
            });
        },

        // test - cancel cleared pods
        t11: function() {

            var selector = '.tgt';

            $(selector).hx([
                {
                    type: 'transform',
                    translate: {y: '+=300'},
                    duration: 800,
                    done: function() {
                        console.log('done_a');
                    }
                },
                {
                    type: 'opacity',
                    value: 0.3,
                    duration: 800,
                    done: function() {
                        console.log('done_b');
                    }
                }

            ])
            .hx({
                type: 'opacity',
                value: null,
                duration: 800,
                done: function() {
                    console.log('done_c');
                }
            })
            .hx({
                type: 'opacity',
                value: 0,
                duration: 800,
                done: function() {
                    console.log('done_d');
                }
            })
            .done(function() {
                console.log('done1');
            });

            setTimeout(function() {

                $(selector)
                .hx( 'clear' )
                .hx([
                    {
                        type: 'transform',
                        translate: null,
                        duration: 800
                    },
                    {
                        type: 'opacity',
                        value: null,
                        duration: 800
                    }
                ])
                .done(function() {
                    console.log('done2');
                });
    
            }, 400 );
        },

        // test - gravity easing
        t12: function() {

            var selector = '.tgt';

            if ($(selector).hasClass( 'clicked-once' )) {
                $(selector).hx({
                    type: 'transform',
                    translate: {x: '+=15', y: 0},
                    rotateX: '+=20'
                });
                $(selector).removeClass( 'clicked-once' );
                return;
            }

            $('.tgt2')
            .hx( 'defer' )
            .then(function( resolve , reject ) {
                //throw new Error( 'whaaaaat' );
                //reject(0);
                var stupid;
                stupid.dumb = 5;
                console.log('test');
            })
            .hx({
                type: 'transform',
                rotateZ: 360,
                duration: 1200,
                easing: 'easeInOutBack'
            });

            $(selector)
            .hx([
                {
                    type: 'opacity',
                    value: 0.5,
                    duration: 1200,
                    easing: 'easeInOutBack'
                },
                {
                    type: 'transform',
                    //matrix: {a2: '-=15'},
                    translate: {y: 300},
                    rotateZ: 20,
                    scale: {x: 0.5, y: 0.5},
                    //order: [ 'scale' , 'translate' , 'rotateZ' ],
                    duration: 1200,
                    easing: 'easeInOutBack'
                }
            ])
            .done(function() {
                console.log('done!');
                $('.tgt2').hx( 'resolve' );
            });

            $(selector).addClass( 'clicked-once' );

            //console.log($(selector).get(0)._hx);


            /*var selector = '.tgt';

            $(selector).hx({
                type: 'transform',
                translate: {y: $(selector).hasClass( 'fall' ) ? 0 : 600},
                duration: 1200,
                easing: $(selector).hasClass( 'fall' ) ? 'gravityUp' : 'gravityDown'
            })
            .done(function() {
                $(this).toggleClass( 'fall' );
                tests.t12();
            });*/
        },

        // test - request animation frame
        t13: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            var duration = 800;

            var opacity = $(selector).hx( 'get' , 'opacity' ).reduce(function( previous , current ) {
                return (previous + (typeof current === 'number' ? current : Object.keys( current ).length));
            } , 0 );

            if (!opacity) {
                $(selector).hx( 'update' , {
                    type: 'opacity',
                    value: 1
                });
            }

            $(selector).hx([
                {
                    type: 'transform',
                    rotateZ: ($(selector).hasClass( 'reverse' ) ? null : '+=180'),
                    duration: duration,
                    easing: 'easeOutBack'
                },
                {
                    type: 'transform',
                    translate: ($(selector).hasClass( 'reverse' ) ? null : {y: '+=100'}),
                    // translate: {
                    //     y: ($(selector).hasClass( 'reverse' ) ? '-=100' : '+=100')
                    // },
                    duration: duration,
                    order: [ 'translate' , 'rotateZ' ]
                },
                {
                    type: 'opacity',
                    value: ($(selector).hasClass( 'reverse' ) ? null : '-=0.9'),
                    duration: (duration * 2),
                    easing: 'linear'
                }
            ])
            .done(function() {

                console.log(this[0]._hx);
                //console.log(this[0]._hx.componentMOJO);

                $(this).off( 'click' ).on( 'click' , function() {
                    $(this).hx( 'reset' , 'opacity' );
                    console.log(this._hx.componentMOJO);
                });
            });

            $(selector).toggleClass( 'reverse' );
        },

        // test - iterate
        t14: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            //var selector = '.tgt';
            var duration = 600;

            function bounce( initial , element ) {

                var target = element || selector;

                $(target).hx()
                .iterate([
                    /*{
                        type: 'opacity',
                        value: $(target).hasClass( 'reverse' ) ? null : '-=0.5',
                        duration: Math.round(duration/2),
                        delay: Math.round(duration/2),
                        //easing: $(target).hasClass( 'reverse' ) ? 'gravityUp' : 'gravityDown'
                    },*/
                    {
                        type: 'transform',
                        translate: ($(target).hasClass( 'reverse' ) ? null : {y: '+=300'}),
                        scale: ($(target).hasClass( 'reverse' ) ? null : {x: '+=0.3', y: '+=0.3'}),
                        duration: duration,
                        delay: function( element , i ) {
                            return initial ? (i * 50) : 0;
                        },
                        easing: $(target).hasClass( 'reverse' ) ? 'gravityUp' : 'gravityDown'
                    },
                    function( time , progress ) {
                        //console.log(arguments);
                    }
                ])
                .race(function( resolve ) {
                    // var queueLength = $(this).toArray().map(function( node ) {
                    //     return node._hx.queue.length;
                    // });
                    // console.log(queueLength);
                    bounce();
                    resolve();
                });

                $(target).toggleClass( 'reverse' );
            }

            bounce( true );
            toggleAction();

            function toggleAction( current ) {
                var action = (current === pause ? resume : pause);
                $('#target')
                .html( action.name )
                .off( 'touchstart click' )
                .on( 'touchstart click' , action );
            }

            function pause( e ) {
                e.preventDefault();
                $(selector).hx( 'pause' );
                toggleAction( pause );
            }

            function resume( e ) {
                e.preventDefault();
                $(selector).hx( 'resume' );
                toggleAction( resume );
            }
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

        // test - css filters
        t16: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            //var selector = '.tgt';

            $(selector)
            .hx({
                type: 'filter',
                hueRotate: '+=90',
                /*dropshadow: {
                    x: '+=10',
                    y: '+=10',
                    blur: 10,
                    color: 'blue'
                },
                blur: '+=1',*/
                duration: 600
            })
            .done(function() {
                console.log(
                    this.toArray().map(function( node ) {
                        return node._hx.componentMOJO;
                    })
                );
            });
        },

        // test - hx.get
        t17: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            //var selector = '.tgt';

            $(selector).hx( 'update' , [
                {
                    type: 'opacity',
                    value: 0.99
                },
                {
                    type: 'transform',
                    translate: {y: '+=300'},
                    scale: {x: '+=0.3', y: '+=0.3'}
                }
            ]);
            
            console.log($(selector).hx( 'get' , 'transform' , 'translate' , true ));
            // console.log($(selector).hx( 'get' , null , null , false ));
            // console.log($(selector).hx( 'get' , 'opacity' , 'value' , true ));

            // $(selector).hx( 'reset' );
            // console.log($(selector).hx( 'get' , null , null , false ));
        },

        // test - SubscriberMOJO
        t18: function() {

            var selector = '.tgt,.tgt2,.tgt3';
            //var selector = '.tgt';
            var duration = 600;
            var count = $(selector).length;

            $(selector).hx([
                {
                    type: 'opacity',
                    value: '-=0.4',
                    duration: duration,
                    /*delay: function( element , i ) {
                        return (count - i) * 100;
                    }*/
                },
                {
                    type: 'transform',
                    translate: {y: '+=150'},
                    scale: null,
                    duration: duration,
                    /*delay: function( element , i ) {
                        return (count - i) * 100;
                    }*/
                },
                /*{
                    type: 'background-color',
                    value: null,
                    duration: duration,
                    delay: function( element , i ) {
                        return (count - i) * 100;
                    }
                },*/
                function( time , progress ) {
                    console.log(progress);
                }
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
                /*{
                    type: 'background-color',
                    value: '#808080',
                    duration: duration
                }*/
            ]);
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






















