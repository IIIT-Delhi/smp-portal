DELETE FROM server_meetings;
INSERT INTO server_meetings ("meetingId", "schedulerId", "title", "date", "time", "attendee", "description")
VALUES
    ('1', '1', 'SetByMentor1', '09/11/2023', '12:30', 2, 'Test Meeting from mentorId=1'),
    ('2', '5', 'SetByMentor5', '10/11/2023', '01:30', 2, 'Test Meeting from mentorId=5'),
    ('3', '1', 'SetForMentors', '10/11/2023', '02:30', 1, 'Test Meeting from AdminId=1'),
    ('4', '1', 'SetForMentees', '11/11/2023', '03:30', 2, 'Test Meeting from AdminId=1'),
    ('5', '1', 'SetForBoth', '12/11/2023', '04:30', 3, 'Test Meeting from AdminId=1');