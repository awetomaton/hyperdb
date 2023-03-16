#!/bin/bash

createdb DBNAME
psql -U $POSTGRES_USER -d "DBNAME" -a -f /opt/create_tables.sql -v ON_ERROR_STOP=1