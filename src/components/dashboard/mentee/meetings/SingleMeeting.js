import React from 'react'

export default function SingleMeeting({meet, userDetails, isPreviousMeeting}) {

    const handleButtonClick = (e) => {
        e.stopPropagation();
    };

    const meetingId = `meeting-${meet.meetingId}`

  return (
    <div className='mb-2'>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button btn-sm collapsed" onClick={handleButtonClick} type="button" data-bs-toggle="collapse" data-bs-target={`#${meetingId}`} aria-expanded="true" aria-controls={meetingId}>
            {meet.title} - Date: {meet.date}, Time: {meet.time}
            </button>
          </h2>
          <div id={meetingId} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body" >
              {/* <strong>Meeting ID : {meet.meetingId}, Meeting Title : {meet.title}</strong>  */}
              <strong>Meeting ID : {meet.meetingId}, Meeting Title : {meet.title}</strong>
              <p>Time: {meet.time}</p>
              <p>Date: {meet.date}</p>
              <p>
                Attendee:
                <br />
                {Array.isArray(meet.attendee) ? (
                  meet.attendee.map((attendee, index) => (
                    <li key={index}>{attendee}</li>
                  ))
                ) : (
                  <li>{meet.attendee}</li>
                )}
              </p>
              <p>Description:<br/>{meet.description}</p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
