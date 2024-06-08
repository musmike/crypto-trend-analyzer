#!/bin/bash

# Uruchomienie serwera MongoDB w tle
mongod --bind_ip 0.0.0.0 &

# Import danych do kolekcji "coins" z pliku coins.json
mongoimport --host localhost --db coin --collection coins --file coins.json --jsonArray

# Import danych do kolekcji "events" z pliku events.json
mongoimport --host localhost --db coin --collection events --file events.json --jsonArray
