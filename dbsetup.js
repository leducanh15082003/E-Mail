const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'wpr',
  password: 'fit2024',
  multipleStatements: true 
});

const dbSetupQuery = `
  CREATE DATABASE IF NOT EXISTS wpr2101040017;
  USE wpr2101040017;
  
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );

  CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    attachment_filename VARCHAR(255),
    attachment_originalname VARCHAR(255),
    is_deleted_for_sender BOOLEAN DEFAULT FALSE,
    is_deleted_for_receiver BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );

  -- Insert users
  INSERT INTO users (email, fullName, password) VALUES 
    ('a@a.com', 'a', '123'), 
    ('b@b.com', 'b', 'password1'), 
    ('c@c.com', 'c', 'password2');

  -- Insert emails
  INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES
    (1, 2, 'Hello B', 'This is an email to B from A.'),
    (2, 1, 'Re: Hello A', 'This is a reply to A from B.'),
    (1, 3, 'Hello C', 'This is an email to C from A.'),
    (3, 1, 'Re: Hello C', 'This is a reply to A from C.'),
    (2, 3, 'Hello C', 'This is an email to C from B.'),
    (3, 2, 'Re: Hello B', 'This is a reply to B from C.'),
    (2, 1, 'Another email to A', 'Second email to A from B.'),
    (1, 2, 'Final email', 'Another email to B from A.');
`;

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');

  connection.query(dbSetupQuery, (err) => {
    if (err) throw err;
    console.log('Database, tables and data created');
    connection.end();
  });
});
