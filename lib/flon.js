module.exports = exports = (function flonFactory() {
    var tx;
    var at;
    var ch;
    var col;
    var line;

    var error = function flonError(message) {
        throw new Error(message +
            "\n    [" + line + ":" + col + "] " + tx.split('\n')[line - 1] + '\n' +
            Array(String(line).length + String(col).length + col + 8).join(' ') + '^');
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
                }
            } else {
                break;
            }
        }
    };

    var value = function flonValue() {
        skipWhitespaceAndComments();
        if      (ch == '{') return object();
        else if (ch == '[') return array();
        else if (ch == '"' || ch == "'") return string();
        else error('Bad value, first character not recognized'); 
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

        return s;

        
    };

    var object = function flonObject() {
        var o = {};
        next();
        while (ch && ch !== '}') {
            keyValue(o);
        }

        if (ch !== '}') error('Bad object, missing closing brace');
        next();
        return o;
    };

    var array = function flonArray() {
        var a = [];
        
        next();
        
        while (ch && ch !== ']') {
            a.push(value());
            skipWhitespaceAndComments();
        }

        if (ch !== ']') error('Bad array, missing closing bracket');
        next();

        return a;
    };

    var root = function flonRoot() {
        var o = {};
        while (ch) {
            keyValue(o);
        }
        return o;
    };

    var key = function flonKey() {
        var k = '';
        if (isAlpha(ch)) {
            k += ch;
            next();
            while(isAlphaNumeric(ch)) {
                k += ch;
                next();
            }
        } else {
            error('Bad key');
        }

        return k;

        function isAlpha(c) {
            return c.match(/^[A-Za-z]$/);
        }

        function isAlphaNumeric(c) {
            return c.match(/^[A-Za-z0-9]$/);
        }
    };

    var keyValue = function flonKeyValue(o) {
        var prevObj = o;
        var lastKey;

        skipWhitespaceAndComments();

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

        skipWhitespaceAndComments();
    };

    function checkForCharacter(c, errorMessage) {
        if (ch !== c) error(errorMessage);
    }

    return {
        parse: function flonParse(string) {
            tx = string;
            at = 0;
            ch = tx.charAt(at);
            col = 1;
            line = 1;

            return root();
        },

        stringify: function flonStringify(object) {
            return "";
        }
    };
}());
