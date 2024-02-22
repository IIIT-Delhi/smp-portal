import React from 'react'

export default function Formelement({currmeeting, handletitle,handledate, handletime, handleDescription,formValid,mentees, handleMentee}) {

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <div className="modal-body">
        {formValid ? null : <div className="alert alert-danger">Please fill out all the details!</div>}
        <div className="form-group">
            <label htmlFor="meetingTitle">Title</label>
            <input type="text" value = {currmeeting.title} onChange={handletitle} className="form-control" id="meetingTitle" placeholder="Enter meeting title" />
        </div>
        <div className="form-group">
            <label htmlFor="meetingDate">Date</label>
            <input type="date" value = {currmeeting.date} onChange={handledate} min={new Date().toISOString().split('T')[0]} className="form-control" id="meetingDate" />
        </div>
        <div className="form-group mb-3">
            <label htmlFor="meetingTime">Time</label>
            <input type="time" value = {currmeeting.time} onChange = {handletime} min={new Date().toTimeString().slice(0, 5)} className="form-control" id="meetingTime" />
        </div>

        <div className="accordion mb-2" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button btn-sm collapsed" onClick = {handleButtonClick} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Select Mentees
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body" >
                <div className="form-group">
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {mentees.map((mentee,key) => (
                      <div key={key} className="form-check mx-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={mentee[0]}
                          id={`${key}Check`}
                          checked={currmeeting.menteeList.includes(mentee[0])}
                          onChange={handleMentee}
                        />
                        <label className="form-check-label" htmlFor={`${key}Check`}>
                          {mentee[1]}
                        </label>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
            <label htmlFor="Description">Description</label>
            <textarea type="text" style={{height: "100px"}} value = {currmeeting.description} onChange = {handleDescription} className="form-control" id="meetDescription" placeholder="Enter meeting Details" />
        </div>

      </div>
    </div>
  )
}
