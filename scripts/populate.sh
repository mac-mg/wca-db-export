#!/bin/bash

echo "Waiting for MySQL to be ready..."

until docker exec -i mysql-container mysqladmin ping -u$DB_USER -p$DB_PASSWORD --silent; do
  sleep 5
done

echo "MySQL is ready!"

echo "Populating database..."

docker exec -i mysql-container mysql \
  -u $DB_USER \
  -p$DB_PASSWORD \
  -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

docker exec -i mysql-container mysql \
  -u $DB_USER \
  -p$DB_PASSWORD $DB_NAME < WCA_export/WCA_export.sql
