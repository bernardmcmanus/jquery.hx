import _Q from 'qlite';
var Q = self.Q;
export var all = Q.all;
export var defer = Q.defer;
export var Promise = defer().constructor;
