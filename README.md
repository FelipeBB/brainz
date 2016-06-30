## brainz
In-memory cache made easy

## Instalation
You can manually download it from `dist` folder or get it through `nmp` / `bower`.

### Npm
`npm install --save brainz`

### Bower
`bower install --save brainz`

## Documentation

### new Brainz(obj, set, limit, time)
Brainz constructor.

__arguments__

* `obj` - Object that contains the cached items.
* `set(obj)` - Function that will be executed after the `request` resolve. The first
argument is the updated `obj`. __not required__
* `limit` - Maximum number of items that will be cached in `obj`. __not required__
, *default: 10000*
* `time` - Time in milliseconds that items will be considerated valid in `obj`. __not required__
, *default: 36000000*

### brainz(key, method, [callback])
Caching requests.

__arguments__

* `key` - key is a __string__ used to identify stored values in cache.
* `request(callback)` - Function that will be executed case `key` doesn't exists or expired.
* `callback(err, result)` - Callback that will be executed after `request` resolve or found value 
 from `obj`.

## Examples

The following identifiers will be used for all examples:

```js
var formula = "..something..";
var cache =  //.. object that contains the cached values
 
function calculate(callback) {
//..do some calc, then callback(err, result);
}
function calcCallback(err, result) {
//.. do something with the calculated result
}
```

### 1 Common usage:

```js
var brainz = new Brainz(cache);
brainz(formula, calculate, calcCallback);
```

### 2 Custom `set`

If you want to store the cached values in a specific place like localstorage, cookies or give to it
a new layer of customization before properly cache it, you can use the `set` param.   

```js
function myCustomSet(cachedValues) {
//... do something with the cached values
//... every time that the `cache` changes this method will be executed
}
 
var brainz = new Brainz(cache, myCustomSet);
brainz(formula, calculate, calcCallback);
```


## License
MIT
