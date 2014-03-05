%lex

%{
   var parser = yy.parser; 
%}

%s initial comment

%%

/* Handle comments */

"/*"                            this.begin('comment');
<comment>"*/"                   this.begin('initial');
<comment>[^*\n]+                // eat comment in chunks
<comment>"*"                    // eat the lone star
<comment>\n                     yylineno++;
"//".*                          /* single line comment */

\s+                             /* skip whitespace */
[a-zA-Z][a-zA-Z0-9]*            return 'ID';
\"(?:[^\"\\]|\\.)*\"            yytext = yytext.substr(1,yyleng-2); return 'STRING';
\'(?:[^\'\\]|\\.)*\'            yytext = yytext.substr(1,yyleng-2); return 'STRING';
"{"                             return '{';
"}"                             return '}';
"["                             return '[';
"]"                             return ']';
"."                             return '.';
"+"                             return '+';
<<EOF>>                         return 'EOF';
/lex

%start root

%{
    
%}

%%

root
    : key_value_list EOF        { return $1; }
    ;

key
    : ID                        { $$ = [$1]; $$["append"] = false; }
    | key '.' ID                { $$.push($3); }
    | key '+'                   { $$["append"] = true; }
    ;

value
    : STRING
    | object
    | array
    ;

value_list
    : value                     { $$ = [$1]; }
    | value_list value          { $$.push($2); }
    ;

key_value_list
    : key value                 { $$ = {}; yy.parser.handleSelector($$, $1, $2); }
    | key_value_list key value  { yy.parser.handleSelector($$, $2, $3); }
    ;

object 
    : '{' '}'                   { $$ = {}; }
    | '{' key_value_list '}'    { $$ = $2; }
    ;

array 
    : '[' ']'                   { $$ = []; }
    | '[' value_list ']'        { $$ = $2; }
    ;

%%

parser.handleSelector = function(o, k, v) {
    var prev = o;
    var current = o;
    for (var i = 0; i < k.length; i++) {
        if (!current.hasOwnProperty(k[i])) {
            current[k[i]] = {};
        }
        
        prev = current;
        current = current[k[i]];
    }

    var last = k[k.length - 1];
    if (k.append) {
        if (! (prev[last] instanceof Array)) {
            prev[last] = [];
        }
        prev[last].push(v);
    } else {
        prev[last] = v;
    }
};
