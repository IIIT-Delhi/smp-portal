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
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div>
              {/* Include profile information specific to Mentees */}
              <h4>Admin Meetings</h4>
              <p>
                <strong>Role:</strong> {userDetails?.role}
              </p>
              <p>
                <strong>Email:</strong> {userDetails?.email}
              </p>
              {/* Other Mentee-specific content */}
            </div>
          </div>
        </div>
      </div>


      <div className="container">
        {
          meetings.map((meet) => (
            <SinlgeMeeting meet={meet} key = {meet.id}/>
          ))
        }

        <ScheduleMeetingButton setmeetings = {setmeetings} ></ScheduleMeetingButton>
      </div>

    </div>
  );
}
