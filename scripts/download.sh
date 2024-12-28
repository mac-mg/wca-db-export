#!/bin/bash

echo "Downloading WCA export..."

DB_LINK=https://www.worldcubeassociation.org/export/results/WCA_export.sql

curl -L $DB_LINK -o WCA_export.zip
unzip WCA_export.zip -d WCA_export
sed -i "1d" WCA_export/WCA_export.sql
