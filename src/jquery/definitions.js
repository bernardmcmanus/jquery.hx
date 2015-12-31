export var Methods = [
  [ 'opacity' ],
  [ 'transform' , 'transform' ],
  [ 'translate' , 'transform' ],
  [ 'rotate' , 'transform' ],
  [ 'rotateX' , 'transform' ],
  [ 'rotateY' , 'transform' ],
  [ 'rotateZ' , 'transform' ]
];

export var Properties = [{
  name: 'opacity',
  template: '${value}',
  initial: 1
},{
  name: 'matrix',
  template: 'matrix3d(${a1},${b1},${c1},${d1},${a2},${b2},${c2},${d2},${a3},${b3},${c3},${d3},${a4},${b4},${c4},${d4})',
  initial: {
    a1: 1, b1: 0, c1: 0, d1: 0,
    a2: 0, b2: 1, c2: 0, d2: 0,
    a3: 0, b3: 0, c3: 1, d3: 0,
    a4: 0, b4: 0, c4: 0, d4: 1
  }
},{
  name: 'matrix2d',
  template: 'matrix(${a},${b},${c},${d},${x},${y})',
  initial: { a: 1, b: 0, c: 0, d: 1, x: 0, y: 0 }
},{
  name: 'translate',
  template: 'translate3d(${x}px,${y}px,${z}px)',
  initial: { x: 0, y: 0, z: 0 }
},{
  name: 'translateX',
  template: 'translateX(${value}px)',
  initial: 0
},{
  name: 'translateY',
  template: 'translateY(${value}px)',
  initial: 0
},{
  name: 'translateZ',
  template: 'translateZ(${value}px)',
  initial: 0
},{
  name: 'translate2d',
  template: 'translate(${x}px,${y}px)',
  initial: { x: 0, y: 0 }
},{
  name: 'scale',
  template: 'scale3d(${x},${y},${z})',
  initial: { x: 1, y: 1, z: 1 }
},{
  name: 'scale2d',
  template: 'scale(${x},${y})',
  initial: { x: 1, y: 1 }
},{
  name: 'rotate',
  template: 'rotate3d(${x},${y},${z},${a}deg)',
  initial: { x: 0, y: 0, z: 0, a: 0 },
  getters: [
    [ 'x' , 'y' , 'z' , function( initial , eventual ){
      return eventual;
    }]
  ]
},{
  name: 'rotateX',
  template: 'rotateX(${value}deg)',
  initial: 0
},{
  name: 'rotateY',
  template: 'rotateY(${value}deg)',
  initial: 0
},{
  name: 'rotateZ',
  template: 'rotateZ(${value}deg)',
  initial: 0
}];
