module.exports = exports = (function flonFactory() {
    var tx;
    var at;
    var ch;
    var col;
    var line;

    var root = function flonRoot() {
        var o = {};
        while (ch) {
            keyValue(o);
        }
        return o;
    };    

    var keyValue = function flonKeyValue(o) {
        var prevObj = o;
        var lastKey;
        do {
            var k = key();
            if (!o[k]) o[k] = {};
            prevObj = o;
            o = o[k];
            lastKey = k;
        } while(ch === '.' && next());
        if (ch === '+') {
            next();
            if (! (prevObj[lastKey] instanceof Array) ) {
                prevObj[lastKey] = [];
            }
            prevObj[lastKey].push(value());
        } else {
            prevObj[lastKey] = value();
        }
    };

    var key = function flonKey() {
        var k = '';
        skipWhitespaceAndComments();
        if (isKeyStart(ch)) {
            k += ch;
            next();
            while(isKeyPart(ch)) {
                k += ch;
                next();
            }
        } else {
            error('Bad key');
        }
        skipWhitespaceAndComments();
        return k;

        function isKeyStart(c) {
            return c.match(/^[A-Za-z_]$/);
        }

        function isKeyPart(c) {
            return c.match(/^[A-Za-z0-9_]$/);
        }
    };

    var value = function flonValue() {
        skipWhitespaceAndComments();
        if      (ch == '{') return object();
        else if (ch == '[') return array();
        else if (ch == '"' || ch == "'") return string();
        else error('Bad value, first character not recognized'); 
    };

    var object = function flonObject() {
        var o = {};
        next();
        while (ch && ch !== '}') {
            keyValue(o);
        }
        if (ch !== '}') error('Bad object, missing closing brace');
        next();
        skipWhitespaceAndComments();
        return o;
    };

    var array = function flonArray() {
        var a = [];
        next();
        while (ch && ch !== ']') {
            a.push(value());
        }
        if (ch !== ']') error('Bad array, missing closing bracket');
        next();
        skipWhitespaceAndComments();
        return a;
    };

    var string = function flonString() {
        var quote = ch;
        var s = "";
        next();
        while (ch && ch !== quote) {
            if (ch === '\\') {
                next();
                if (ch === quote) {
                    s += ch;
                    next();
                }
                else {
                    s += '\\' + ch;
                }
            } else {
                s += ch;
                next();
            }
        }
        if (ch !== quote) error('Bad string, missing closing quote');
        next();
        skipWhitespaceAndComments();
        return s;
    };

    var next = function flonNext(c) {
        if(ch === '\n') {
            line++;
            col = 1;
        } else {
            col++;
        }
        at++;
        ch = tx.charAt(at);
        return ch;
    };

    var skipWhitespaceAndComments = function flonskipWhitespaceAndComments() {
        while (ch){
            if (ch <= ' ') {
                next();
            } else if (ch === '/') {
                next();
                if (ch === '*') {
                    next();
                    while (ch) {
                        if (ch === '*') {
                            next();
                            if (ch === '/') {
                                next();
                                break;
                            }
                        } else {
                            next();
                        }
                    }
                } else if (ch === '/') {
                    while(ch && ch !== '\n') {
                        next();
                    }
                } else {
                    error('Bad comment');
                }
            } else {
                break;
            }
        }
    };

    var error = function flonError(message) {
        throw new Error(message +
            "\n    [" + line + ":" + col + "] " + tx.split('\n')[line - 1] + '\n' +
            Array(String(line).length + String(col).length + col + 8).join(' ') + '^');
    };

    return {
        parse: function flonParse(string) {
            tx = string;
            at = 0;
            ch = tx.charAt(at);
            col = 1;
            line = 1;
            return root();
        },
        toJSON: function flonToJSON(object) {
            JSON.stringify(parse(object));
        }
    };
}());
