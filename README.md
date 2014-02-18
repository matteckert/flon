#   WAML

Writeable Associative Markup Language (WAML) is designed to be easy to write and easy to parse. It has only one primitive value type (**string**) and two container types (**object** and **array**). It doesn't have commas to separate items in an object or array, and it doesn't have equals or colon between key-value pairs in objects.

##  Spec

### Datatypes

- **Object**: curly braces with key-value pairs. Keys must be valid JavaScript identifiers.

        object { key "value" }

- **Array**: square brackets with values, objects, or arrays inside.

        array [ "0" "1" [ "2a" "2b" ] { index "3" } ]

- **String**: UTF-8 surrounded by double quotes.

### Root object

The root object is **implied** instead of explicit.

- WAML: `name "matt"`
- JSON: `{ "name": "matt" }`

### Selectors

You can drill down objects with dot notation.

- WAML: `'user.name.first "Matt"'`
- JSON: `{ "user": { "name": { "first": "Matt" } } }`

### Comments

C/JS/Java style.

- `// to end of line`
- `/* multi-line */`

##  Longer examples

### WAML drops the commas and semicolons of JSON:

- WAML

        address {
            streetAddress "21 2nd Street"
            city "New York"
            state "NY"
            postalCode "10021"
        }

- JSON

        {
            "address": {
                "streetAddress": "21 2nd Street",
                "city": "New York",
                "state": "NY",
                "postalCode": "10021"
            }
        }

###How WAML supports dot notation:

- WAML

        database {
            user "matt" pass "password123"
            cluster [
                { server "192.168.1.1" port "8001" }
                { server "192.168.1.2" port "8021" }
                { server "192.168.1.3" port "8042" }
                { server "192.168.1.4" port "8075" }
            ]
        }
        database.name "My Database"
    
- JSON

        {
            "database": {
                "user": "matt", "pass": "password123",
                "clusters": [
                    { "server": "192.168.1.1", "port": "8001" },
                    { "server": "192.168.1.2", "port": "8021" },
                    { "server": "192.168.1.3", "port": "8042" },
                    { "server": "192.168.1.4", "port": "8075" }
                ],
                "name": "My Database"
            }
        }
