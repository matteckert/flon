%lex
%%

\s+                         /* skip whitespace */
[a-zA-Z][a-zA-Z0-9]*        return 'ID';
\"(?:[^\"\\]|\\.)*\"        yytext = yytext.substr(1,yyleng-2); return 'STRING';
"{"                         return '{';
"}"                         return '}';
"["                         return '[';
"]"                         return ']';
"."                         return '.';
"+"                         return '+';
<<EOF>>                     return 'EOF';
/lex

%start root

%%

root
    : key_value_list EOF            { return $1; }
    ;

key
    : ID
    | key '.' ID                    { throw "Selectors are not supported yet!"; }
    | key '+'                       { throw "Selectors are not supported yet!"; }
    ;

value
    : STRING
    | object
    | array
    ;

value_list
    : value                         { $$ = []; $$.push($1); }
    | value_list value              { $$.push($2); }
    ;

key_value_list
    : key value                     { $$ = {}; $$[$1] = $2; }
    | key_value_list key value      { $$[$2] = $3; }
    ;

object 
    : '{' '}'                       { $$ = {}; }
    | '{' key_value_list '}'        { $$ = $2; }
    ;

array 
    : '[' ']'                       { $$ = []; }
    | '[' value_list ']'            { $$ = $2; }
    ;
