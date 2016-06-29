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
