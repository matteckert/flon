var should = require('should');
var flon = require('../lib/flon.js');

describe('flon', function() {
    it('should allow whitespace everywhere', function() {
        var flonText = '  hi.there    {     im     [   "an"    "array"  ]    }  hi.what+   "hi"   ';
        var expected = {"hi": { "there":  { "im" : [ "an", "array" ] }, "what": [ "hi" ] } };

        flon.parse(flonText).should.eql(expected);
    });

    describe('value', function() {
        describe('objects', function() {
            it('should handle nested objects', function() {
                var flonText = 'hi { im "nested" }';
                var expected = {"hi": { "im" : "nested" } };

                flon.parse(flonText).should.eql(expected);
            });

            it('should throw if bad', function() {
                var flonText = 'this.is { seriously "broken!"';

                flon.parse.bind(null, flonText).should.throw(/^Bad object/);
            });
        });

        describe('strings', function() {
            it('should handle simple string values', function() {
                var flonText = 'hi "there"';
                var expected = {"hi": "there"};

                flon.parse(flonText).should.eql(expected);
            });

            it('should handle escaped quotes', function() {
                var flonText = 'hi "\\"there\\""';
                var expected = {"hi": '"there"'};

                flon.parse(flonText).should.eql(expected);
            });

            it('should handle single quoted strings', function() {
                var flonText = "hi 'there'";
                var expected = {"hi": "there"};

                flon.parse(flonText).should.eql(expected);
            });

            it('should handle multi line strings', function() {
                var flonText = 'hi { im "a multi\nline string" }';
                var expected = {"hi": { "im" : "a multi\nline string" } };

                flon.parse(flonText).should.eql(expected);
            });

            it('should throw if bad', function() {
                var flonText = 'this "broken';

                flon.parse.bind(null, flonText).should.throw(/^Bad string/);
            });
        });
        
        describe('arrays', function() {
            it('should allow all types', function() {
                var flonText = 'arrays.can.hold [ "strings" { and "objects" } [ "and" "other" "arrays" ] ]';
                var expected = { "arrays": { "can": { "hold": [ "strings", { "and": "objects" }, [ "and", "other", "arays" ] ] } } };
            });
            it('should throw if bad', function() {
                var flonText = 'this.is [ "broken!"';

                flon.parse.bind(null, flonText).should.throw(/^Bad array/);
            });
        });
    });
    
    describe('keys', function() {
        it('should support underscores', function() {
            var flonText = '_under____scores__ "rule"';
            var expected = {"_under____scores__": "rule"};

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

        it('should throw if bad', function() {
            var flonText = '"porkbutt"';

            flon.parse.bind(null, flonText).should.throw(/^Bad key/);
        });
    });

    describe('comments', function() {
        it('should handle single line comments', function() {
            var flonText = 'hi "there" // all the way to the end\nnot "here"';
            var expected = {"hi": "there", "not": "here"};

            flon.parse(flonText).should.eql(expected);
        });

        it('should handle multi line comments', function() {
            var flonText = '/* beginning */ hi /* between */ "there" /* end */';
            var expected = {"hi": "there"};

            flon.parse(flonText).should.eql(expected);
        });

        it('should ignore single line comments in multi line comments', function() {
            var flonText = 'hi "there" /* // all the way to the end */ not "here"';
            var expected = {"hi": "there", "not": "here"};

            flon.parse(flonText).should.eql(expected);
        });

        it('should ignore comments in strings', function() {
            var flonText = 'hi "/* comment */ there"';
            var expected = {"hi": "/* comment */ there"};

            flon.parse(flonText).should.eql(expected);
        });

        it('should throw if bad', function() {
            var flonText = 'hi "there" /* // all the way to the end *// not "here"';

            flon.parse.bind(null, flonText).should.throw(/^Bad comment/);
        });
    });   
});
