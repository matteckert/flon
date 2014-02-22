%lex
%%

\s+                         /* skip whitespace */
[a-zA-Z][a-zA-Z0-9]*        return 'IDENTIFIER';
\"(?:[^\"\\]|\\.)*\"        return 'STRING_LITERAL'
"{"                         return '{'
"}"                         return '}'
"["                         return '['
"]"                         return ']'
"."                         return '.'
"+"                         return '+'
/lex

%start key_value_list

%%

key
    : IDENTIFIER
    | key '.' IDENTIFIER
    | key '+'
    ;

value
    : STRING_LITERAL
    | object
    | array
    ;

value_list
    : value
    | value_list value
    ;

key_value_list
    : key value
    | key_value_list key value
    ;

object 
    : '{' '}'
    | '{' key_value_list '}'
    ;

array 
    : '[' ']'
    | '[' value_list ']'
    ;
