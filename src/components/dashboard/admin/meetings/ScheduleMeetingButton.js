import React, { useState } from 'react';
import Formelement from './Formelement';

const ScheduleMeetingButton = () => {
    const [showModal, setShowModal] = useState(false);
    const [currmeeting, setcurrmeeting] = useState({
        time : null,
        date : null,
        title : null,
        attendees : [],
    });



    const handleScheduleClick = () => {
        setcurrmeeting({
            time: null,
            date: null,
            title: null,
            attendees: [],
          });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        console.log(currmeeting)
        setShowModal(false);
    };

    return (
        <>
            <button className="btn btn-primary btn-floating position-fixed" style={{ bottom: '20px', right: '20px' }} onClick={handleScheduleClick}>
                Schedule Meeting
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
                                <button type="button" className="btn btn-primary" onClick={handleCloseModal}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScheduleMeetingButton;
