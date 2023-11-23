import React from 'react'
import { useState, useEffect,useCallback} from 'react';
import axios from 'axios';

export default function Attendance({handleClose,handleButtonSave,meetingId}) {

    const [attendanceList, setattendanceList] = useState([]);

    const fetchAttendance = useCallback( async () => {
        try {
        //   console.log(userDetails)
          const response = await axios.post("http://127.0.0.1:8000/getAttendance/",
          JSON.stringify({
            meetingId: meetingId,
          }));

        //   console.log(response.data.attendees)

          if (response.status === 200) {
            setattendanceList(response.data.attendees)
          }
        } catch (error) {
          console.error("Error fetching Attendance:", error);
        }
    }, [meetingId]);

    useEffect(() => {
        // if(isFirstTime){setisFirstTime(false);fetchMeetings();}
        fetchAttendance();
    }, [fetchAttendance]);

    const handleCheckboxChange = (studentId) => {
        setattendanceList((prevAttendanceList) => {
          return prevAttendanceList.map((student) => {
            if (student.id === studentId) {
              return { ...student, attendance: student.attendance === 0 ? 1 : 0 };
            }
            return student;
          });
        });
      };


  return (
    <div>
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Take Attendance</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            
            {attendanceList ? (
            <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th className='text-center'>Mark Attendance</th>
                      <th className='text-center'>Roll Number</th>
                      <th className='text-center'>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((student) => (
                      <tr key={student.id}>
                        <td className='text-center'>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`attendanceCheckbox${student.id}`}
                            checked={student.attendance === 1}
                            onChange={() => handleCheckboxChange(student.id)}
                          />
                        </td>
                        <td className='text-center'>{student.id}</td>
                        <td className='text-center'>{student.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

            </div> ) : (
                <p>Loading Attendance....</p>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleButtonSave}>
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

