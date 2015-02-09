// Karma configuration
// Generated on Tue Sep 02 2014 23:03:20 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: [ 'mocha', 'sinon-chai' ],
    files: [ 
        'test/performance-polyfill.js',
        'test/bind-polyfill.js',
        'test/jquery-2.0.2.min.js',
        'js/includes/wee-promise-0.1.4.min.js',
        'js/includes/mojo-0.1.6.min.js',
        'js/includes/bezier-easing-0.4.1.js',
        'js/hxManager.js',
        'js/shared/helper.js',
        'js/shared/inject.js',
        'js/shared/config.js',
        'js/shared/vendorPatch.js',
        'js/shared/bezier.js',
        'js/shared/easing.js',
        'js/domNode/styleDefinition.js',
        'js/domNode/cssProperty.js',
        'js/domNode/componentMOJO.js',
        'js/domNode/transitionMOJO.js',
        'js/domNode/queue.js',
        'js/domNode/domNodeFactory.js',
        'js/pod/timingMOJO.js',
        'js/pod/subscriberMOJO.js',
        'js/pod/bean.js',
        'js/pod/iteratorMOJO.js',
        'js/pod/animationPod.js',
        'js/pod/precisionPod.js',
        'js/pod/promisePod.js',
        'js/pod/podFactory.js',
        'js/hx.js',
        'js/init/init.js',
        'test/tests.js'
    ],
    exclude: [ ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { },
    reporters: [ 
        'mocha' 
    ],
    port: 9876,
    colors: true,
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // optionally run in chrome as well as phantomjs... but why??
    browsers: [ 
        //'Chrome',
        'PhantomJS'
    ]

  });
};
