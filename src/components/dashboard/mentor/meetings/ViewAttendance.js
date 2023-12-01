import React from 'react'
import { useState, useEffect,useCallback} from 'react';
import axios from 'axios';

export default function ViewAttendance({handleClose,meetingId}) {

    const [attendanceList, setattendanceList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAttendanceList, setFilteredAttendanceList] = useState([]);

    useEffect(() => {
      // Update the filtered list when the search query or attendanceList changes
      const filteredList = attendanceList.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.toString().includes(searchQuery)
      );
      setFilteredAttendanceList(filteredList);
    }, [searchQuery, attendanceList]);

    const fetchAttendance = useCallback( async () => {
        try {
        //   console.log(userDetails)
          const response = await axios.post("https://smpportal.iiitd.edu.in/api/getAttendance/",
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


  return (
    <div>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Current Attendance</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            
            {filteredAttendanceList ? (
            <div className="modal-body">

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or roll number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <table className="table">
                  <thead>
                    <tr style={{width : '100%'}}>
                      <th className='text-center' style={{width : '50%'}}>Roll Number</th>
                      <th className='text-center' style={{width : '50%'}}>Name</th>
                    </tr>
                  </thead>
        
                  <tbody style={{maxHeight : '60vh',overflowY : 'auto'}}>
                    {filteredAttendanceList.map((student) => ( (student.attendance === 1 ) &&
                      <tr key={student.id} style={{width : '100%'}}>
                        <td className='text-center' style={{width : '50%'}} >{student.id}</td>
                        <td className='text-center' style={{width : '50%'}}>{student.name}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

