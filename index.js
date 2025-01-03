const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const setupDatabase = require('./dbsetup');

const db = require("./db/database")
const signinRoute = require('./routes/signin');
const signupRoute = require('./routes/signup');
const inboxRoutes = require('./routes/inbox');
const outboxRoutes = require('./routes/outbox');
const composeRoutes = require('./routes/compose');
const emailDetailRoutes = require('./routes/emailDetail');
const signoutRoute = require('./routes/signout');
const route403 = require("./routes/403");
const deleteEmailRoute = require('./routes/deleteEmails');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.use('/', signinRoute);
app.use('/signup', signupRoute);
app.use('/inbox', inboxRoutes);
app.use('/outbox', outboxRoutes);
app.use('/', composeRoutes);
app.use('/emails', emailDetailRoutes);
app.use('/', signoutRoute);
app.use('/', route403);
app.use('/', deleteEmailRoute);

setupDatabase()
  .then(() => {
    console.log('Database setup completed');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database setup failed', err);
  });

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });
