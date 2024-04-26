#!/bin/bash

# Install Python and pip
sudo apt-get update
sudo apt-get install -y python3=3.11.5 python3-pip

# dowload enginx
sudo apt install python3-pip python3-dev nginx

# Install Node.js
sudo apt install nodejs npm
npm install

#Install prostresql
sudo apt-get install -y postgresql

# Create PostgreSQL database and user
apt-get install -y postgresql
sudo -u postgres psql -c "CREATE DATABASE smp;"
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD '12345';"
sudo -u postgres psql -c "ALTER ROLE admin SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE admin SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE smp TO admin;"



sudo ufw allow 8000

# Install virtualenv
pip3 install virtualenv
# Install system dependencies
python3 -m venv sdos
cd sdos
sudo chown -R iiitd:iiitd /home/iiitd/smp/smp-portal/sdos
cd ..
source sdos/bin/activate


# Install Python dependencies
pip3 install typing-extensions sqlparse asgiref django
pip3 install django gunicorn
pip3 install pytz typing-extensions sqlparse psycopg2 psutil asgiref Django==4.2.5 djangorestframework==3.14.0 django-cors-headers==4.3.0


# Move to the directory and start the models
cd backend
python3 manage.py makemigrations 
python3 manage.py migrate
cd ..
