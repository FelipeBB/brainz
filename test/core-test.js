var expect = require('chai').expect;
var Brainz = require('../brainz');

var fakeAjax = function(time, callback) {
    setTimeout(callback, time, null, time);
};

describe('tests', function() {
    it('get from cache', function(done) {
        var expiration = (new Date().getTime())*2;
        var cache = { '100': [200, expiration] };
        var brainz = new Brainz(cache);
        brainz('100', function(callback) {
            fakeAjax(100, callback);
        }, function(err, result) {
            expect(err).to.be.null;
            expect(result).to.be.equal(200);
            done();
        });
    });

    it('set in cache', function(done) {
        var expiration = (new Date().getTime())*2;
        var cache = { '100': [200, expiration] };
        var brainz = new Brainz(cache);
        brainz('400', function(callback) {
            fakeAjax(400, callback);
        }, function(err, result) {
            expect(err).to.be.null;
            expect(result).to.be.equal(400);
            expect(cache).to.include.keys('400');
            done();
        });
    });

    it('limit', function(done) {
        done();
    });

    it('clean cache', function(done) {
        done();
    });

    it('expiration', function(done) {
        done();
    });
});
