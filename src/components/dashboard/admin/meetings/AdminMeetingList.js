import React, { useState } from 'react'
import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import SinlgeMeeting from './SinlgeMeeting';
import ScheduleMeetingButton from './ScheduleMeetingButton';

export default function AdminMeetingList() {
  const { userDetails } = useAuth();
  const [meetings, setmeetings] = useState([]);

  return (
    <div>
      <Navbar userDetails={userDetails} />
      <div className="container mt-4 text-center mb-4">
          <h1 className="font-weight-bold mb-4">Meeting Schedule</h1>
      </div>

      <div style={{display : 'flex', height: '70vh', justifyContent: 'space-between', position : 'relative'}}>
        <div className="container" style={{ marginLeft: '5px', marginRight: '0', width: '85%', overflowY: 'auto' }}>
          {
            meetings.map((meet) => (
              <SinlgeMeeting meet={meet} key = {meet.id}/>
            ))
          }
        </div>
        
        <div style={{ position: 'relative' , width : '15%'}}>
          {/* <div style={{ position: 'absolute', textAlign: 'center' }}> */}
            <ScheduleMeetingButton setmeetings={setmeetings} />
          {/* </div> */}
        </div>

        {/* <div style={{ position: 'fixed', bottom: '20px', right: '20px', border: '2px solid blue' }}>
          <ScheduleMeetingButton setmeetings = {setmeetings} ></ScheduleMeetingButton>
        </div> */}
      </div>

    </div>
  );
}
