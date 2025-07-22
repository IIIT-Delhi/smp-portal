# Student Mentorship Portal

## Introduction
Student Mentorship Portal is a web application developed to streamline the student mentorship program at IIIT-Delhi. It provides functionalities for students and mentors to interact, schedule meetings, and manage mentorship tasks effectively.

## Features
- Student and mentor profiles
- Meeting scheduling
- Task management
- Communication platform

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

### Prerequisites
- Node.js
- npm
- Python 3.x
- Virtual environment (venv)

### Steps
1. Clone the repository and install dependencies:
    ```bash
    git clone https://github.com/IIIT-Delhi/smp-portal.git
    cd smp-portal
    pip install -r requirements.txt
    ```

2. Setup the backend:
    ```bash
    cd backend
    python -m venv env
    .\env\Scripts\activate
    ```

3. Setup the frontend:
    ```bash
    cd ..
    npm install
    ```

4. Start the development server:
    ```bash
    cd backend
    source env/bin/activate
    python manage.py runserver
    ```

5. In another terminal, start the frontend:
    ```bash
    cd frontend
    npm start
    ```

## Usage

### Running the Application
- The backend will run on `http://localhost:8000/`
- The frontend will run on `http://localhost:3000/`

### Available Scripts
In the project directory, you can run:
- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For any questions or feedback, please contact the project maintainers through [issues](https://github.com/IIIT-Delhi/smp-portal/issues).
