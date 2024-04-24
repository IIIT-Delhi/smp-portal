#!/bin/bash

# Install Python and pip
sudo apt-get update
sudo apt-get install -y python3 python3-pip

# Install virtualenv
sudo pip3 install virtualenv

# Set up virtual environment
virtualenv myenv
sudo python3 -m venv sdos
source sdos/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install system dependencies
sudo apt-get install -y postgresql

# Create PostgreSQL database and user
sudo -u postgres psql -c "CREATE DATABASE smp;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD '12345';"
sudo -u postgres psql -c "ALTER ROLE postgres SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE postgres SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mydatabase TO postgres;"

# Move to the directory and start the models
cd backend
python3 manage.py makemigrations 
python3 manage.py migrate
cd ..
