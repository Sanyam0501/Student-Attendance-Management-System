# Students' College Attendance Management System

This project is a web-based application designed to manage student attendance efficiently. Professors can log in, mark attendance, and monitor attendance records for individual students.

## Features

- **Professor Login:** Secure login system for professors to access attendance records.
- **Division Selection:** Professors can choose between Div A or Div B to manage attendance.
- **Mark Attendance:** Easily mark students as present or absent for a specific date.

## Technology Stack

**Frontend:**
- HTML
- CSS
- JavaScript
- Bootstrap 5

**Backend:**
- Node.js
- Express.js

**Database:**
- SQLite3

## Folder Structure

```plaintext
.
├── html
│   ├── admin_login.html       # HTML File
│   ├── attendance.html        # HTML File
│   ├── index.html             # HTML File
│   ├── main_index.html        # HTML File
│
├── js
│   ├── server.js              # JS File
│
├── database
│   ├── attendance.db          # Database File
│
├── css
│   ├── admin_login.css        # CSS File
│   ├── attendance.css         # CSS File
│   ├── font.css               # CSS File
│   ├── index.css              # CSS File
│
├── fonts
│   ├── Barlow                 # Font Folder
│
├── images
│   ├── about-us.jpg           # Image File
│   ├── attendance.jpg         # Image File
│   ├── background-image.jpg   # Image File
│   ├── email-photo.jpeg       # Image File
│   ├── login.jpg              # Image File
│   ├── logo.png               # Image File
```

## Future Enhancements

- Add graphical representations of attendance (e.g., bar charts, pie charts).
- Implement notifications for low attendance.
- Add a calendar view for attendance tracking.
- Improve division handling efficiently.

## Usage

1. Open the web browser.
2. **LOG IN** with user admin credentials or else you won’t be able to see the page details (Default: username: `admin`, password: `admin@123`).
3. Go to the "Attendance" button in the navbar.
4. Enter the details of the student.
5. See the attendance report by searching the student’s name in the database.
6. **LOG OUT** when finished.


