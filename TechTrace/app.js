require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
// const socket = require('socket.io');
// const http = require('http');
// const server = http.createServer(app);
// const io = socket(server);
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var branchRouter = require('./routes/branch'); // Import branch router
var taskRouter = require('./routes/task');
var accessoiresRouter = require('./routes/accessories');
var app = express();
app.use(cors());

// Connect to MongoDB
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    console.log('DB Connected!');
  } catch (err) {
    console.log('DB connection error:', err);
  }
}

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/branch', branchRouter); // Use branch router
app.use('/task', taskRouter);
app.use('/accessories', accessoiresRouter);
// Increase the request size limit
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true, limit: "50mb" })); 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
