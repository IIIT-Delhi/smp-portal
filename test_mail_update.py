#!/usr/bin/env python3
"""
Test script to verify the email content update functionality
"""
import json
import os
import requests
import sys

def test_mail_content_update():
    """Test the mail content update API"""
    
    # Test data
    test_data = {
        "type": "consent",
        "subject": "Test Subject - Updated",
        "body": "Test body content - This is a test update.\n\nThis should be saved permanently."
    }
    
    print("Testing mail content update API...")
    print(f"Test data: {test_data}")
    
    try:
        # Test the update API
        response = requests.post(
            "http://localhost:8000/api/updateMailContent/",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Update API call successful!")
            
            # Test retrieving the updated content
            retrieve_data = {"type": "consent"}
            retrieve_response = requests.post(
                "http://localhost:8000/api/getMailSubjectAndBody/",
                json=retrieve_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if retrieve_response.status_code == 200:
                retrieved_data = retrieve_response.json()
                print(f"Retrieved data: {retrieved_data}")
                
                if (retrieved_data.get('subject') == test_data['subject'] and 
                    retrieved_data.get('body') == test_data['body']):
                    print("✅ Content was successfully updated and retrieved!")
                else:
                    print("❌ Retrieved content doesn't match what was saved")
            else:
                print(f"❌ Failed to retrieve updated content: {retrieve_response.status_code}")
        else:
            print(f"❌ Update API failed: {response.status_code}")
            print(f"Error message: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the Django server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_mail_content_update()
