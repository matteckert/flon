var should = require('should');
var flon = require('../lib/flon.js');

describe('flon', function() {
    it('should handle simple string values', function() {
        var flonText = 'hi "there"';
        var expected = {"hi": "there"};

        flon.parse(flonText).should.eql(expected);
    });

    it('should handle nested objects', function() {
        var flonText = 'hi { im "nested" }';
        var expected = {"hi": { "im" : "nested" } };

        flon.parse(flonText).should.eql(expected);
    });

    it('should handle simple dot notation selectors', function() {
        var flonText = 'dot.notation.is "cool"';
        var expected = {"dot":{"notation":{"is":"cool"}}};

        flon.parse(flonText).should.eql(expected);
    });

    it('should handle more than one dot notation selector', function() {
        var flonText = 'dot.notation.is "cool" dot.notation.grows.on "you"';
        var expected = {"dot":{"notation":{"is":"cool","grows":{"on":"you"}}}};

        flon.parse(flonText).should.eql(expected);
    });

    it('should handle array append notation', function() {
        var flonText = 'append.here+ "nice"';
        var expected = {"append":{"here":["nice"]}};

        flon.parse(flonText).should.eql(expected);
    });

    it('should handle appending to an array that already exists', function() {
        var flonText = 'append { here ["this" "is" "very"] } append.here+ "nice"';
        var expected = {"append":{"here":["this","is","very","nice"]}};

        flon.parse(flonText).should.eql(expected);
    });
});
