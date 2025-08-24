import os
import coverage
import subprocess

def run_tests():
    # Specify the path to your Django project
    django_project_path = "C:\\Users\\Sharm\\Desktop\\smp\\backend"

    # Change the current working directory to your Django project path
    os.chdir(django_project_path)

    # Initialize coverage
    cov = coverage.Coverage(source=['server'])  # Replace 'app1', 'app2', ... with your app names
    cov.start()

    # Specify the test file or files to include
    test_files = ['server/tests.py', 'server/test2.py']  # Replace with your test file paths

    for test_file in test_files:
        # Run pytest with coverage for the specified test file
        subprocess.run(['python3', '-m', 'coverage', 'run', '-m', 'pytest', test_file])

    # Stop coverage
    cov.stop()

    # Save coverage results
    cov.save()

    # Generate coverage report
    cov.report()

if __name__ == "__main__":
    run_tests()
