var should = require('should');
var flon = require('../lib/flon.js');

describe('parse', function() {
    it('should allow extra whitespace everywhere', function() {
        flon.parse('  a.b+  {  c.d  [  "e"  ]  }  ').should.eql({a: {b: [{c: {d: ['e']}}]}});
    });

    describe('value', function() {
        describe('objects', function() {
            it('should handle nested objects', function() {
                flon.parse('a {b "c"}').should.eql({a: {b: 'c'}});
            });

            it('should throw if bad', function() {
                flon.parse.bind(null, 'a { b "c"').should.throw(/^Bad object/);
            });
        });

        describe('strings', function() {
            it('should handle simple string values', function() {
                flon.parse('a "b"').should.eql({a: 'b'});
            });

            it('should handle escaped quotes', function() {
                flon.parse('a "\\"b\\""').should.eql({a: '"b"'});
            });

            it('should handle single quoted strings', function() {
                flon.parse("a 'b'").should.eql({a: 'b'});
            });

            it('should handle multi line strings', function() {
                flon.parse('a "b\nc"').should.eql({a: 'b\nc' });
            });

            it('should throw if bad', function() {
                flon.parse.bind(null, 'a "b').should.throw(/^Bad string/);
            });
        });
        
        describe('arrays', function() {
            it('should allow all types', function() {
                flon.parse('a [ "" {} [] ]').should.eql({a: ["", {}, []]});
            });
            it('should throw if bad', function() {
                flon.parse.bind(null, 'a [ "b"').should.throw(/^Bad array/);
            });
        });
    });
    
    describe('keys', function() {
        it('should support underscores', function() {
            flon.parse('_a__b_ "c"').should.eql({_a__b_: 'c'});
        });

        it('should handle simple dot notation selectors', function() {
            flon.parse('a.b.c "d"').should.eql({a: {b: {c: 'd'}}});
        });

        it('should handle more than one dot notation selector', function() {
            flon.parse('a.b "c" a.d "e"').should.eql({a: {b: 'c', d: 'e'}});
        });
        
        it('should handle array append notation', function() {
            flon.parse('a.b+ "c"').should.eql({a: {b: ['c']}});
        });

        it('should handle appending to an array that already exists', function() {
            flon.parse('a ["b"] a+ "c"').should.eql({a: ['b', 'c']});
        });

        it('should throw if bad', function() {
            flon.parse.bind(null, '"a"').should.throw(/^Bad key/);
        });
    });

    describe('comments', function() {
        it('should handle single line comments', function() {
            flon.parse('a "b" // c\nd "e"').should.eql({a: 'b', d: 'e'});
        });

        it('should handle multi line comments', function() {
            flon.parse('/* a */ b /* c */ "d" /* e */').should.eql({b: 'd'});
        });

        it('should ignore comments inside comments', function() {
            flon.parse('a "b" /* // c */ d "e"').should.eql({a: 'b', d: 'e'});
        });

        it('should ignore comments in strings', function() {
            flon.parse('a "/* b */ c"').should.eql({a: '/* b */ c'});
        });

        it('should throw if bad', function() {
            flon.parse.bind(null, 'a "b" /* // c *// d "e"').should.throw(/^Bad comment/);
        });
    });
});
