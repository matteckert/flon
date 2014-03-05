#   FLON

Flat Object Notation (FLON) is designed to be easy to read and write. It has only one primitive value type (**string**) and two container types (**object** and **array**). It doesn't have commas to separate items in an object or array, and it doesn't have equals or colons between key-value pairs in objects.

##  Spec

### Datatypes

- **Object**: curly braces with key-value pairs. Keys must be valid JavaScript identifiers.

        object { key "value" }

- **Array**: square brackets with strings, objects, or arrays inside.

        array [ "0" "1" [ "2a" "2b" ] { index "3" } ]

- **String**: UTF-8 surrounded by double quotes.

### Root object

The root object is **implied** instead of explicit.

- FLON: `user "matt"`
- JSON: `{ "user": "matt" }`

### Selectors

You can drill down objects with dot notation.

- FLON: `user.name.first "Matt"`
- JSON: `{ "user": { "name": { "first": "Matt" } } }`

You can select and append to arrays using a plus after the selector.

- FLON: `users+ "Sam"`
- JSON: `{ "users": [ "Sam" ] }`

### Comments

C/JS/Java style.

- `// to end of line`
- `/* multi-line */`

##  Longer examples

### No commas or colons

- FLON

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

### Selector example

- FLON

        cluster {
            name "My Cluster"
            service "My Service"
        }
        
        cluster.node+ {
            city "New York"
            state "NY"
            server "192.128.0.3"
            port "4003"
        }
        
        cluster.node+ {
            city "Austin"
            state "TX"
            server "192.128.0.4"
            port "4004"
        }
        
        cluster.node+ {
            city "Los Angeles"
            state "CA"
            server "192.128.0.2"
            port "4002"
        }
        
- JSON

        {
            "cluster": {
                "name": "My Cluster",
                "service": "My Service",
                "node": [
                    {
                        "city": "New York",
                        "state": "NY",
                        "server": "192.128.0.3",
                        "port": "4003"
                    },

                    {
                        "city": "Austin",
                        "state": "TX",
                        "server": "192.128.0.4",
                        "port": "4004"
                    },

                    {
                        "city": "Los Angeles",
                        "state": "CA",
                        "server": "192.128.0.2",
                        "port": "4002"
                    }
                ]
            }
        }        
