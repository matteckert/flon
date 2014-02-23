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
    : key_value_list EOF        { return $1; }
    ;

key
    : ID                        { $$ = []; $$.push($1); }
    | key '.' ID                { $$.push($3); }
    | key '+'                   { throw new Error("Append selector not implemented yet."); }
    ;

value
    : STRING
    | object
    | array
    ;

value_list
    : value                     { $$ = []; $$.push($1); }
    | value_list value          { $$.push($2); }
    ;

key_value_list
    : key value                 {
                                    $$ = {};

                                    var prev = $$;
                                    var current = $$;

                                    for (var i = 0; i < $1.length; i++) {
                                        
                                        current[$1[i]] = {};
                                        
                                        prev = current;
                                        current = current[$1[i]];
                                    }

                                    prev[$1[$1.length - 1]] = $2;
                                }
    | key_value_list key value  {
                                    var prev = $$;
                                    var current = $$;

                                    for (var i = 0; i < $2.length; i++) {
                                        
                                        if (!current.hasOwnProperty($2[i])) {
                                            current[$2[i]] = {};
                                        }
                                        
                                        prev = current;
                                        current = current[$2[i]];
                                    }

                                    prev[$2[$2.length - 1]] = $3;
                                }
    ;

object 
    : '{' '}'                   { $$ = {}; }
    | '{' key_value_list '}'    { $$ = $2; console.log("parsing object with props"); }
    ;

array 
    : '[' ']'                   { $$ = []; }
    | '[' value_list ']'        { $$ = $2; }
    ;
