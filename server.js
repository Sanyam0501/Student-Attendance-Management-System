const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

const dbFile = "attendance.db"; 
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

app.get("/search_student", (req, res) => {
  const { division, name } = req.query;
  const tableName = division === "A" ? "division_a" : "division_b";

  console.log(`Searching for student: ${name} in division: ${division}`);  // Log search parameters

  db.all(
    `SELECT student_name, attendance_date, present, absent 
     FROM ${tableName}
     WHERE student_name LIKE ?`,
    [`%${name}%`],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving student attendance:", err); // Log the error
        return res.status(500).json({ error: "Error retrieving data" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Aggregate the presence and absence counts
      const totalPresent = rows.filter(row => row.present > 0).length;
      const totalAbsent = rows.filter(row => row.absent > 0).length;

      res.json({
        student_name: name,
        total_present: totalPresent,
        total_absent: totalAbsent,
        attendance_report: rows
      });
    }
  );
});


app.use(
  session({
    secret: "sanyam", 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

function redirectIfNotLoggedIn(req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect("/");
  }
  next();
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/admin_login.html");
});

app.post("/admin_login", (req, res) => {
  const { username, password } = req.body;
  
  if (username === "admin" && password === "admin@123") {
    req.session.loggedin = true;
    req.session.username = username;
    res.sendFile(__dirname + "/main_index.html");
  } else {
    res.send("Invalid credentials.");
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.redirect("/"); 
    }
  });
});

app.get("/main_index", redirectIfNotLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/main_index.html");
});

app.get("/attendance", redirectIfNotLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/attendance.html");
});

app.post("/submit_attendance", (req, res) => {
  const { division, attendance } = req.body;

  console.log("Received data:", req.body);  // Log the received data

  if (!division || !attendance || !Array.isArray(attendance)) {
    return res.status(400).json({ error: "Invalid data provided." });
  }

  const tableName = division === "A" ? "division_a" : "division_b";
  const errors = [];

  attendance.forEach(({ id, name, status, date }) => {
    const columnToUpdate = status === "present" ? "present" : "absent";

    const updateQuery = `
      UPDATE ${tableName}
      SET ${columnToUpdate} = ${columnToUpdate} + 1
      WHERE student_id = ?
        AND attendance_date = ?
    `;

    db.run(updateQuery, [id, date], function (err) {
      if (err) {
        console.error(`Error updating attendance for ${name}:`, err);
        errors.push(`Failed to update attendance for ${name}`);
      } else if (this.changes === 0) {
        const insertQuery = `
          INSERT INTO ${tableName} (student_id, student_name, present, absent, attendance_date)
          VALUES (?, ?, ?, ?, ?)
        `;
        const isPresent = columnToUpdate === "present" ? 1 : 0;
        const isAbsent = columnToUpdate === "absent" ? 1 : 0;

        db.run(insertQuery, [id, name.trim(), isPresent, isAbsent, date], (insertErr) => {
          if (insertErr) {
            console.error(`Error inserting student ${name}:`, insertErr);
            errors.push(`Failed to add student ${name}`);
          }
        });
      }
    });
  });

  setTimeout(() => {
    if (errors.length > 0) {
      res.status(500).json({ error: errors.join(", ") });
    } else {
      res.send("Attendance updated successfully.");
    }
  }, 100);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
