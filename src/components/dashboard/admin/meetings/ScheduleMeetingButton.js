import React, { useState } from 'react';
import Formelement from './Formelement';

const ScheduleMeetingButton = ({setmeetings}) => {
    const [showModal, setShowModal] = useState(false);
    const [currmeeting, setcurrmeeting] = useState({
        id : null,
        time : '',
        date : '',
        title : '',
        attendees : [],
    });



    const handleScheduleClick = () => {
        setcurrmeeting({
            id : null,
            time: '',
            date: '',
            title: '',
            attendees: [],
          });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveModal = () => {
        const newMeeting = { ...currmeeting, id: Date.now() }
        setcurrmeeting(newMeeting); // Update the current meeting state
        setmeetings(prevMeetings => [...prevMeetings, newMeeting]); // Add the new meeting to meetings
        setShowModal(false);
    }

    return (
        <div>
            {/* <i class="bi bi-plus-circle"></i> */}
            <button className="btn btn-primary btn-floating position-fixed" style={{ bottom: '20px', right: '20px' }} onClick={handleScheduleClick}>
                {/* Schedule Meeting */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Schedule Meeting</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Formelement currmeeting = {currmeeting} setcurrmeeting = {setcurrmeeting}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveModal}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleMeetingButton;
