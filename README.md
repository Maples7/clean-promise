# clean-promise
A minimal and clean implement of JavaScript ES6 Promise, which passes all [standard test cases](https://github.com/promises-aplus/promises-tests).

## Usage
> \> npm install clean-promise        

## APIs
- ```.then([function(any value) onResolved], [function(any error) onRejected])  ->  Promise``` 
- ```.catch(function(any error) onRejected)  ->  Promise```
- ```.spread(function(any values...) cb, [onRejected])  ->  Promise```
- ```.all(Iterable<any>|Promise<Iterable<any>> input)  ->  Promise```
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

## License
MIT
