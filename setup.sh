#!/bin/bash

# Install Python and pip
sudo apt-get update
sudo apt-get install -y python3 python3-pip

# Install virtualenv
sudo pip3 install virtualenv

# Set up virtual environment
virtualenv myenv
sudo apt update 
sudo apt install python3-pip python3-dev nginx



# Install Node.js
sudo apt install nodejs npm
npm install

#Install prostresql
sudo apt-get install -y postgresql

# Create PostgreSQL database and user
sudo -u postgres psql -c "CREATE DATABASE smp;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD '12345';"
sudo -u postgres psql -c "ALTER ROLE postgres SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE postgres SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mydatabase TO postgres;"

# Install system dependencies
sudo python3 -m venv sdos
source sdos/bin/activate

# Install Python dependencies
pip install -r requirements.txt
pip install django gunicorn

sudo ufw allow 8000

# Move to the directory and start the models
cd backend
python3 manage.py makemigrations 
python3 manage.py migrate
cd ..
