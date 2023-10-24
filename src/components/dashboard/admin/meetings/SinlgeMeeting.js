import React from 'react'

export default function SinlgeMeeting({meeting}) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };


  return (
    <div>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" onClick={handleButtonClick} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Meeting ID : {meeting.id}
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body" >
              <strong>Meeting ID : {meeting.id}, Meeting Title : {meeting.title}</strong> 
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
