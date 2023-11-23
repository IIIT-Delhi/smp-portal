import React from 'react'

export default function ChangeMentor({handleClose,handleSave,editMentee,seteditMentee,currMentee}) {

    const handleSave2 = () => {
        if(editMentee.mentorId){
            handleSave()
        }
        else {
            alert('Please Input Mentor ID')
        }
    }

    const branchOptions = {
        "B-CSB": "CSB",
        "B-CSSS": "CSSS",
        "B-CSD": "CSD",
        "B-CSE": "CSE",
        "B-CSAI": "CSAI",
        "B-CSAM": "CSAM",
        "B-ECE": "ECE",
        "B-EVE": "EVE",
        "M-CSE": "CSE",
        "M-ECE": "ECE",
        "M-CB": "CB",
    };

    return (
        <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Mentor for Mentee</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                
                <div className="modal-body">
                    {/* Display mentee's profile information here */}
                    <div>
                    <h6>Mentee:</h6>
                    <img
                        src={currMentee.imgSrc}
                        alt="Mentee Profile"
                        className="img-fluid img-thumbnail mt-4 mb-2"
                        sstyle={{ maxWidth: "400px", maxHeight: "400px", borderRadius: "10%" }}
                    />
                    <p>Name: {currMentee.name}</p>
                    <p>Roll Number: {currMentee.id}</p>
                    <p>Email: {currMentee.email}</p>
                    <p>
                        Programme:
                        {currMentee.department.startsWith("B") ? "B.Tech" : "M.Tech"}
                    </p>
                    <p>
                        Branch:
                        {branchOptions[currMentee.department]}
                    </p>
                    <p>Contact: {currMentee.contact}</p>
                    <p>Current Mentor Name: {currMentee.mentorName}</p>
                    <p>Current Mentor ID: {currMentee.mentorId}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newMentorId">New Mentor ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="newMentorId"
                            value={editMentee.mentorId}
                            onChange={(e) => seteditMentee({...editMentee, mentorId : e.target.value})}
                        />
                    </div>
                </div>

    
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSave2}>
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}
