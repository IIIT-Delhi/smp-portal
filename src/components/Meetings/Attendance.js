import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function Attendance({ handleClose, handleButtonSave, meetingId, type }) {

  const [attendanceList, setattendanceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAttendanceList, setFilteredAttendanceList] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    // Update the filtered list when the search query or attendanceList changes
    const filteredList = attendanceList.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toString().includes(searchQuery)
    );
    setFilteredAttendanceList(filteredList);

    const presentCount = filteredList.filter((student) => student.attendance === 1).length;
    setAttendanceCount(presentCount);
  }, [searchQuery, attendanceList]);

  const fetchAttendance = useCallback(async () => {
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

  const updateAttendance = async () => {
    const response1 = await axios.post("https://smpportal.iiitd.edu.in/api/updateAttendance/",
      JSON.stringify({
        meetingId: meetingId,
        attendees: attendanceList
      }));

    if (response1.status === 200) {
      alert('Attendance updated succesfully');
    }

  }

  const handleSave = () => {
    updateAttendance();
    handleButtonSave();
  }

  useEffect(() => {
    // if(isFirstTime){setisFirstTime(false);fetchMeetings();}
    fetchAttendance();
  }, [fetchAttendance]);

  const handleCheckboxChange = (studentId) => {
    setattendanceList((prevAttendanceList) => {
      const updatedList = prevAttendanceList.map((student) => {
        if (student.id === studentId) {
          const newAttendanceValue = student.attendance === 0 ? 1 : 0;
          // Update attendance count on checkbox change
          setAttendanceCount(attendanceCount + (newAttendanceValue - student.attendance));
          return { ...student, attendance: newAttendanceValue };
        }
        return student;
      });

      return updatedList;
    });
  };


  return (
    <div>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{type === 'take' ? 'Take Attendance' : 'Current Attendance'}</h5>
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
                <div>
                  <p> Total Attendace : {attendanceCount}</p>
                </div>
                <div className="table-header">
                  <table className="table">
                    <thead>
                      <tr style={{ width: '100%' }}>
                        {type === 'take' && (
                          <th className='text-center' style={{ width: '33%' }}>Mark Attendance</th>
                        )}
                        <th className='text-center' style={{ width: '33%' }}>Roll Number</th>
                        <th className='text-center' style={{ width: '33%' }}>Name</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                {/* Make the table body scrollable */}
                <div className="table-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <table className="table">
                    <tbody>
                      {filteredAttendanceList.map((student) => (((type === 'take') || (type === 'view' && student.attendance === 1)) &&
                        <tr key={student.id} style={{ width: '100%' }}>
                          {type === 'take' &&
                            (<td className='text-center' style={{ width: '33%' }}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`attendanceCheckbox${student.id}`}
                                checked={student.attendance === 1}
                                onChange={() => handleCheckboxChange(student.id)}
                              />
                            </td>
                            )}
                          <td className='text-center' style={{ width: '33%' }}>{student.id}</td>
                          <td className='text-center' style={{ width: '33%' }}>{student.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>Loading Attendance....</p>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>
                Close
              </button>
              {type === 'take' && (
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

