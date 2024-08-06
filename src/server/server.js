const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const multer = require('multer');


const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: 'Dhuwa@123',  
  database: 'signup' 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL!');
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());


const upload = multer({
    dest: 'uploads/', 
    limits: {
      fileSize: 5 * 1024 * 1024 
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload an image'));
      }
      cb(undefined, true);
    }
  });



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/signup', upload.single('profileImage'), (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const profileImage = req.file;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Server error');
    }

    const imageUrl = profileImage ? profileImage.filename : null;
    const query = 'INSERT INTO customers (first_name, last_name, email, password, profile_image) VALUES (?, ?, ?, ?, ?)';

    connection.query(query, [firstName, lastName, email, hashedPassword, imageUrl], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Server error');
      }
      res.status(201).send('User registered successfully');
    });
  });
});

  app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM customers WHERE email = ?';

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Server error');
      }

      if (result) {
        return res.status(200).send('Login successful');
      } else {
        return res.status(401).send('Incorrect password');
      }
    });
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the connection if needed elsewhere
module.exports = connection;
