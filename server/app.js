var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
console.log('TYPE OF noteRoutes:', typeof noteRoutes);
console.log('noteRoutes:', noteRoutes);

const knex = require("./config/knex.js");

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());  // Enable CORS for all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Knex middleware to attach the db instance to req
app.use((req, res, next) => {
  req.db = knex;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});
app.use('/auth', authRoutes);
console.log('About to mount /notes route');
app.use('/notes', noteRoutes);
console.log('About to mount /notes route');

// Test Knex connection
app.get("/knex", function (req, res, next) {

  req.db

    .raw("SELECT VERSION()")

    .then((version) => console.log(version[0][0]))

    .catch((err) => {

      console.log(err);

      throw err;

    });

  res.send("Version Logged successfully");

});

// catch 404 and forward to error handler

app.use(function (req, res, next) {

  next(createError(404));

});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message,
    error: err
  });
});


module.exports = app;
