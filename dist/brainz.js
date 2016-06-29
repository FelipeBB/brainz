(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Brainz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Brainz(get, set, limit, time) {
    this.cached = get;
    this.setMethod = set || function(){};
    this.limit = limit || 10000;
    this.expirationIn = time || 360000000; // 1 hour

    var execute = function(key, method, callback) {
        if (this.checkIfIsInCache(key) && !this.checkIfExpired(key))
            return callback(null, this.cached[this.chosenKey][0]);
        return this.runMethod(key, method, callback);
    }.bind(this);

    return execute;
}

Brainz.prototype.checkIfIsInCache = function(key) {
    return !Object.keys(this.cached).every(function(ckey) {
        if (key === ckey) {
            this.chosenKey = key;
            return false;
        }
        return true;
    }.bind(this));
};

Brainz.prototype.checkIfExpired = function(key) {
    return this.cached[key][1] < (new Date().getTime());
};

Brainz.prototype.insertInCache = function(key, result) {
    this.cleanCache();
    if (Object.keys(this.cached).length < this.limit)
        this.cached[key] = [result, (new Date().getTime()) +  this.time];
};

Brainz.prototype.cleanCache = function() {
    Object.keys(this.cached).forEach(function(el) {
        if (this.checkIfExpired(el))
           delete this.cached[el];
    }.bind(this));
};

Brainz.prototype.runMethod = function(key, method, callback) {
    method(function(err, result) {
        if (err) return callback();
        this.insertInCache(key, result);
        callback(null, result);
    }.bind(this));
};

module.exports = Brainz;

},{}]},{},[1])(1)
});