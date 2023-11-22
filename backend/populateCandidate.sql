DELETE FROM server_candidate;
INSERT INTO server_candidate ("id", "email", "name", "department", "year", "status", "size", "contact", "score", "imgSrc")
VALUES
    ('1', 'vishesh20550@iiitd.ac.in', 'Vishesh Jain', 'B-CSB', 'B4', 5, 'M', '1234567890', 100, ''),
    ('2', 'john12345@iiitd.ac.in', 'John', 'B-CSAI', 'B3', 1, 'L', '1234567891', 90, ''),
    ('3', 'joe12345@iiitd.ac.in', 'Joe', 'B-CSE', 'B3', 2, 'L', '1234567892', 90, ''),
    ('4', 'max12345@iiitd.ac.in', 'Max', 'B-CSAM', 'B4', 3, 'M', '1234567893', 70, ''),
    ('5', 'lisa12345@iiitd.ac.in', 'Lisa', 'B-CSE', 'B4', 5, 'L', '1234567894', 100, '');