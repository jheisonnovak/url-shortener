#!/bin/bash

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER replicator REPLICATION LOGIN ENCRYPTED PASSWORD '$REPLICATOR_PASSWORD';
    CREATE DATABASE auth_service;
    GRANT ALL PRIVILEGES ON DATABASE auth_service TO $POSTGRES_USER;
EOSQL

mkdir -p /var/lib/postgresql/archive
chown postgres:postgres /var/lib/postgresql/archive
