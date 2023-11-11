import React from 'react'

export default function Formelement({currmeeting, handletitle,handledate, handletime, handleDescription,formValid}) {

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

        <div className="form-group">
            <label htmlFor="Description">Description</label>
            <textarea type="text" style={{height: "100px"}} value = {currmeeting.description} onChange = {handleDescription} className="form-control" id="meetDescription" placeholder="Enter meeting Details" />
        </div>

      </div>
    </div>
  )
}
