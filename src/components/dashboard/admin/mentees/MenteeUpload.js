// MenteeUpload.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const MenteeUpload = ({closeModal,fetchMenteeList }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async() => {
    if (selectedFile) {
        
        const formData = new FormData();
        formData.append('csvFile', selectedFile);

        console.log(typeof(formData))
        console.log(selectedFile)

        try {
            await axios.post('http://127.0.0.1:8000/uploadCSV/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully');
            fetchMenteeList();
        } catch (error) {
            console.error('Error uploading file', error);
        }

        closeModal();
    }
  };

  return (
    <div>

        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Upload Mentee CSV</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* your code here */}

                        <div className="form-group mb-3">
                            <label htmlFor="csvFile">Select CSV File</label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="csvFile"
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default MenteeUpload;
