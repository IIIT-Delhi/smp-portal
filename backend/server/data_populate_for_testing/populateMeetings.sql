DELETE FROM server_meetings;
INSERT INTO server_meetings ("meetingId", "schedulerId", "title", "date", "time", "attendee", "description", "mentorBranches")
VALUES
    ('1', '101', 'SetByMentor1', '2023-11-09', '12:30', 2, 'Test Meeting from mentorId=1', '[]'),
    ('2', '105', 'SetByMentor5', '2023-12-12', '01:30', 2, 'Test Meeting from mentorId=5', '[]'),
    ('3', '1', 'SetForMentors', '2023-11-10', '02:30', 1, 'Test Meeting from AdminId=1','["B-CSB","B-CSAI"]'),
    ('4', '1', 'SetForMentees', '2023-12-11', '03:30', 2, 'Test Meeting from AdminId=1', '[]'),
    ('5', '1', 'SetForBoth', '2023-12-11', '04:30', 3, 'Test Meeting from AdminId=1','["B-CSB","B-CSAI"]');
