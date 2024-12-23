// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   multipleStatements: true 
// });

// const dbSetupQuery = `
//   CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};
//   USE ${process.env.DB_NAME};
  
//   CREATE TABLE IF NOT EXISTS users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     fullName VARCHAR(100) NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
//     );

//   CREATE TABLE IF NOT EXISTS emails (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     sender_id INT NOT NULL,
//     receiver_id INT NOT NULL,
//     subject VARCHAR(255),
//     body TEXT,
//     attachment_filename VARCHAR(255),
//     attachment_originalname VARCHAR(255),
//     is_deleted_for_sender BOOLEAN DEFAULT FALSE,
//     is_deleted_for_receiver BOOLEAN DEFAULT FALSE,
//     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (sender_id) REFERENCES users(id),
//     FOREIGN KEY (receiver_id) REFERENCES users(id)
//   );

//   -- Insert users
//   INSERT INTO users (email, fullName, password) VALUES 
//     ('a@a.com', 'a', '123'), 
//     ('b@b.com', 'b', 'password1'), 
//     ('c@c.com', 'c', 'password2');

//   -- Insert emails
//   INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES
//     (1, 2, 'Hello B', 'This is an email to B from A.'),
//     (2, 1, 'Re: Hello A', 'This is a reply to A from B.'),
//     (1, 3, 'Hello C', 'This is an email to C from A.'),
//     (3, 1, 'Re: Hello C', 'This is a reply to A from C.'),
//     (2, 3, 'Hello C', 'This is an email to C from B.'),
//     (3, 2, 'Re: Hello B', 'This is a reply to B from C.'),
//     (2, 1, 'Another email to A', 'Second email to A from B.'),
//     (1, 2, 'Final email', 'Another email to B from A.');
// `;

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to MySQL');

//   connection.query(dbSetupQuery, (err) => {
//     if (err) throw err;
//     console.log('Database, tables and data created');
//     connection.end();
//   });
// });


const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  const dbSetupQuery = `
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};
    USE ${process.env.DB_NAME};

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
      attachment_url VARCHAR(255),
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );

    INSERT IGNORE INTO users (email, fullName, password) VALUES 
      ('a@a.com', 'a', '123'), 
      ('b@b.com', 'b', 'password1'), 
      ('c@c.com', 'c', 'password2');

    INSERT IGNORE INTO emails (sender_id, receiver_id, subject, body) VALUES
      (1, 2, 'Hello B', 'This is an email to B from A.'),
      (2, 1, 'Re: Hello A', 'This is a reply to A from B.'),
      (1, 3, 'Hello C', 'This is an email to C from A.'),
      (3, 1, 'Re: Hello C', 'This is a reply to A from C.');
  `;

  await connection.query(dbSetupQuery);
  console.log('Database setup complete');
  await connection.end();
}

module.exports = setupDatabase;
