#WAML

Writeable Associative Markup Language

##Examples

###WAML drops the commas and semicolons of JSON:

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
            },
        }

###WAML supports dot notation:

- WAML

        database {
            user "matt" pass "password123"
            cluster [
                { server "192.168.1.1" port 8001 }
                { server "192.168.1.2" port 8021 }
                { server "192.168.1.3" port 8042 }
                { server "192.168.1.4" port 8075 }
            ]
        }
        database.name "My Database"
    
- JSON

        {
            "database": {
                "user": "matt", "pass": "password123",
                "clusters": [
                    { "server": "192.168.1.1", "port": 8001 },
                    { "server": "192.168.1.2", "port": 8021 },
                    { "server": "192.168.1.3", "port": 8042 },
                    { "server": "192.168.1.4", "port": 8075 }
                ],
                "name": "My Database"
            }
        }
        
###Upstream objects are inferred:

- WAML
    
        user.name.last "Doe"

- JSON

        {
            "user": {
                "name": {
                    "last": "Doe"
                }
            }
        }

