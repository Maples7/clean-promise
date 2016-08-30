# clean-promise
[![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg?maxAge=2592000)](https://www.npmjs.com/package/clean-promise)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](https://www.npmjs.com/package/clean-promise)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](http://spdx.org/licenses/MIT)   
  
A minimal and clean implement of JavaScript ES6 Promise, which passes all [standard test cases](https://github.com/promises-aplus/promises-tests).

## Installation
> \> npm install clean-promise      

## Usage
You can use it like this in your own code:
```js
const Promise = require('clean-promise');

Promise.all([Promise.resolve(1), 2, 3]).return(4444)
    .tap(v => {
        console.log('1 ' + v);
    }).tap(v => {
        console.log('2 ' + v);
    }).return(3).tap(v => {
        console.log('2 ' + v);
    });
```        

## APIs
- ```.then([function(any value) onResolved], [function(any error) onRejected])  ->  Promise``` 
- ```.catch(function(any error) onRejected)  ->  Promise```
- ```.spread(function(any values...) cb, [onRejected])  ->  Promise```
- ```.all(Iterable<any> | Promise<Iterable<any>> input)  ->  Promise```
- ```.map(function(any item, int index, int length) mapper, [function(any error) onRejected])  ->  Promise```
- ```.return(Promise<any> | any value)  ->  Promise```
- ```.tap([function(any value) onResolved])  ->  Promise```
- ```Promise.resolve(Promise<any> | any value)  ->  Promise```
- ```Promise.reject(any error)  ->  Promise```
- ```Promise.all(Iterable<any> | Promise<Iterable<any>> input)  ->  Promise```
- ```Promise.map(Iterable<any> | Promise<Iterable<any>> input, function(any item, int index, int length) mapper)  ->  Promise```
- ```Promise.race(Iterable<any> | Promise<Iterable<any>> input)  ->  Promise```
- ```Promise.try(function() fn)  ->  Promise```

## Features
* multiple ES6 features are applied: const/let, Class, Symbol, => etc   
* clean, explict and fast
* both available on back-end and front-end

## Test
> \> npm test   

## ChangeLog

### V 1.1.0 - 2016.08.26
* fix async bugs in .all & .return
* add .tap API

### V 1.0.0 - 2016.08.26
* finish all basical functions
* do some basical tests
* fix async bugs in Promise.all & Promise.map
* add .map API

## License
MIT
