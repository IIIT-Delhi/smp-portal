import React from 'react'

export default function Formelement({currmeeting, handletitle,handledate, handletime}) {

  return (
    <div>
      <div className="modal-body">
        <div className="form-group">
            <label htmlFor="meetingTitle">Title</label>
            <input type="text" value = {currmeeting.title} onChange={handletitle} className="form-control" id="meetingTitle" placeholder="Enter meeting title" />
        </div>
        <div className="form-group">
            <label htmlFor="meetingDate">Date</label>
            <input type="date" value = {currmeeting.date} onChange={handledate} className="form-control" id="meetingDate" />
        </div>
        <div className="form-group mb-3">
            <label htmlFor="meetingTime">Time</label>
            <input type="time" value = {currmeeting.time} onChange = {handletime} className="form-control" id="meetingTime" />
        </div>

      </div>
    </div>
  )
}
