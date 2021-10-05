const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('morgan');
const dotenv = require('dotenv');
var bodyParser = require('body-parser')
const helmet = require('helmet');
const mongoose = require('mongoose');


const app = express();

// Config .env
dotenv.config();

// Connect mongoDB
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
  console.log("Connected to MongoDB")
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 

// Route
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const authRouter  = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// middleware
app.use(helmet());
app.use(morgan("common"));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Router Chemin
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth' , authRouter );

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
