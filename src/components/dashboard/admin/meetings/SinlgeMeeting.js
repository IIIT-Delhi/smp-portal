import React from 'react'

export default function SinlgeMeeting({meet}) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const meetingId = `meeting-${meet.id}`

  return (
    <div className='mb-2' style={{width:'100%'}}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" onClick={handleButtonClick} type="button" data-bs-toggle="collapse" data-bs-target={`#${meetingId}`} aria-expanded="true" aria-controls={meetingId}>
              Meeting ID : {meet.id}
            </button>
          </h2>
          <div id={meetingId} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body" >
              <strong>Meeting ID : {meet.id}, Meeting Title : {meet.title}</strong> 
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
