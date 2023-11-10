DELETE FROM server_candidate;
INSERT INTO server_candidate ("id", "email", "name", "department", "year", "status", "size", "score", "imgSrc")
VALUES
    ('1', 'vishesh20550@iiitd.ac.in', 'Vishesh Jain', 'B-CSB', 'B4', 3, 'M', 100, ''),
    ('2', 'john12345@iiitd.ac.in', 'John', 'B-CSAI', 'B3', 1, 'L', 90, ''),
    ('3', 'joe12345@iiitd.ac.in', 'Joe', 'B-CSE', 'B3', 2, 'L', 90, ''),
    ('4', 'max12345@iiitd.ac.in', 'Max', 'B-CSAM', 'B4', 4, 'M', 70, ''),
    ('5', 'lisa12345@iiitd.ac.in', 'Lisa', 'B-CSE', 'B4', 3, 'L', 100, '');