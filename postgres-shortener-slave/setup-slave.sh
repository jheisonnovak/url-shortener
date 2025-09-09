#!/bin/bash
set -e

echo "Starting slave setup for URL Shortener..."

echo "Waiting for master to be ready..."
until PGPASSWORD=${POSTGRES_PASSWORD} pg_isready -h postgres-shortener-master -p 5432 -U postgres; do
    echo "Master not ready yet, waiting..."
    sleep 5
done

echo "Master is ready!"

if [ ! -f "/var/lib/postgresql/data/PG_VERSION" ] || [ ! -s "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "Setting up fresh slave replication..."
    
    rm -rf /var/lib/postgresql/data/*
    
    sleep 10
    
    echo "Creating base backup from master..."
    PGPASSWORD=replicator123 pg_basebackup \
        -h postgres-shortener-master \
        -D /var/lib/postgresql/data \
        -U replicator \
        -v \
        -P \
        -W \
        -R \
        --checkpoint=fast
    
    echo "Base backup completed successfully!"
else
    echo "Data directory already exists, skipping base backup"
fi

chown -R postgres:postgres /var/lib/postgresql/data
chmod 700 /var/lib/postgresql/data

echo "Starting PostgreSQL in standby mode..."
exec gosu postgres postgres -c config_file=/etc/postgresql/postgresql.conf -c hba_file=/etc/postgresql/pg_hba.conf
