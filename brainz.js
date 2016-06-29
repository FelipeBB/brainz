/***
 * Brainz constructor
 * @param {Object} get - object that contains cached items
 * @param {function} set - not mandatory
 * @param {number} limit - maxlength of cached items
 * @param {number} time - time that key will persist as valid in cache
 * @returns {function(this:Brainz)}
 * @constructor
 */
function Brainz(get, set, limit, time) {
    this.cached = get;
    this.setMethod = set || function () {};
    this.limit = limit || 10000;
    this.expirationIn = time || 36000000; // 10 minutes

    var execute = function (key, method, callback) {
        if (this.checkIfIsInCache(key) && !this.checkIfExpired(key))
            return callback(null, this.cached[key][0]);
        return this.runMethod(key, method, callback);
    }.bind(this);

    return execute;
}

/***
 * check if key is already in cache
 * @param {string} key
 * @returns {boolean}
 */
Brainz.prototype.checkIfIsInCache = function (key) {
    return !Object.keys(this.cached).every(function (ckey) {
        return !(key === ckey)
    });
};

/***
 * check if cached object expired
 * @param {string} key
 * @returns {boolean}
 */
Brainz.prototype.checkIfExpired = function (key) {
    return this.cached[key][1] < (new Date().getTime());
};

/***
 * insert key/value in cache
 * @param {string} key
 * @param {Array<string, Object>} result
 */
Brainz.prototype.insertInCache = function (key, result) {
    this.cleanCache();
    if (Object.keys(this.cached).length >= this.limit)
        return;

    var value = [result, (new Date().getTime()) + this.expirationIn];
    this.cached[key] = value;
    this.setMethod(this.cached);
};

/***
 * remove expired keys from cache
 */
Brainz.prototype.cleanCache = function () {
    Object.keys(this.cached).forEach(function (el) {
        if (this.checkIfExpired(el))
            delete this.cached[el];
    }.bind(this));
};

/***
 * execute method when key is not in chache
 * @param {string} key
 * @param {function} method
 * @param {function(err, result)} callback
 */
Brainz.prototype.runMethod = function (key, method, callback) {
    method(function (err, result) {
        if (err) return callback(err);
        this.insertInCache(key, result);
        callback(null, result);
    }.bind(this));
};

module.exports = Brainz;
