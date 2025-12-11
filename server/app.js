var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

var app = express();


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors());  // Enable CORS for all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error', {
//   title: 'Error',
//   message: err.message,
//   error: err
// });
// });

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // optional: log error in console
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
