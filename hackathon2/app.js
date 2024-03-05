const https = require('https');
const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const path = require('path'); // Import path module
const bodyParser = require('body-parser'); // Import body-parser module

// Improved database creation logic (optional)
function createDatabaseAndTables(con) {
  con.query('create database if not exists hackathon;', (err) => {
    if (err) throw err;
    console.log('Database created');

    con.query('use hackathon;', (err) => {
      if (err) throw err;

      con.query('create table if not exists Donor(id int AUTO_INCREMENT PRIMARY KEY, Name varchar(50) not null, Phone_Number int(10) not null, email_id varchar(150) not null, Address varchar(200) not null);', (err) => {
        if (err) throw err;
        console.log('Donor table created');
      });

      con.query('create table if not exists NGO(id int AUTO_INCREMENT PRIMARY KEY, Name varchar(50) not null, Phone_Number int(10) not null, email_id varchar(150) not null, Address varchar(200) not null, Number_of_People int not null, VERIFICATION bool not null);', (err) => {
        if (err) throw err;
        console.log('NGO table created');
      });
    });
  });
}



const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

app.use(express.static(path.join(__dirname, 'public')));





const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',
  port: 100
});

con.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Call the database and table creation function
  createDatabaseAndTables(con); // Optional

  const server = https.createServer(app, (req, res) => {
    fs.readFile(path.join(__dirname, 'main.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
  }).listen(1000); // Changed port number to 1000

  console.log('Server is running on port 1000');
});


app.post('/submit', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address;

  // Validate and sanitize user input (if needed)

  con.query('INSERT INTO Donor (Name, Phone_Number, email_id, Address) VALUES (name, phone, email, address)', (err, result) => {
    if (err) throw err;
    console.log('Data inserted successfully');
    res.send('Data submitted successfully!'); // Send a response to the client
  });
});