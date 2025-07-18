#!/usr/bin/env python3
"""
Test script to verify JSON form management functionality
"""
import json
import os
import sys

# Add the backend directory to the Python path
sys.path.append('/home/fakepickle/Programming/Git/smp-portal/backend')

def test_json_file_paths():
    """Test that we can access the JSON files"""
    project_root = "/home/fakepickle/Programming/Git/smp-portal"
    
    json_files = {
        'registration': 'src/data/registrationQuestions.json',
        'consent': 'src/data/consentQuestions.json',
        'feedback': 'src/data/menteeFeedbackQuestions.json',
    }
    
    print("Testing JSON file access...")
    
    for form_type, relative_path in json_files.items():
        file_path = os.path.join(project_root, relative_path)
        print(f"\nTesting {form_type} form:")
        print(f"  Path: {file_path}")
        print(f"  Exists: {os.path.exists(file_path)}")
        
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    questions = data.get('questions', [])
                    print(f"  Questions loaded: {len(questions)}")
                    if questions:
                        print(f"  First question ID: {questions[0].get('id', 'N/A')}")
                        print(f"  First question text: {questions[0].get('question', 'N/A')[:50]}...")
            except Exception as e:
                print(f"  Error loading file: {e}")
        else:
            print(f"  File not found!")

if __name__ == "__main__":
    test_json_file_paths()
