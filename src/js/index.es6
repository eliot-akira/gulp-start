// In browser code
require("babelify/polyfill");

console.log('Hey');

{ let a = 'I am declared inside an anonymous block'; }

console.log(a); // ReferenceError: a is not defined