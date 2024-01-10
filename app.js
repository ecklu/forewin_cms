var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var Handlebars = require('handlebars')
var expressHbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var passport = require('passport')
var flash = require('connect-flash')
var validator = require('express-validator')
var MongoStore = require('connect-mongo')(session)


// Import the cron job setup
require('./config/cron');

var usersRouter = require('./routes/user');
var dashboard = require('./routes/index')


var connectUsersRouter = require('./routes/connect_users')
var connectQueRouter = require('./routes/connect_que')
var mapRouter = require('./routes/maps')
var reportRouter = require('./routes/report')
var activeRouter = require('./routes/active_users')
/*var indexRouter = require('./routes/index');
var surveyTitleRouter = require('./routes/connect_que')
var connectUsersRouter = require('./routes/connect_users')
var surveyQuestiosRouter = require('./routes/survey_questions')
var surveyAssignRouter = require('./routes/survey_assign')
var surveyChartRouter = require('./routes/survey_chart')
var surveyAnswerRouter = require('./routes/survey_answer')
var testSurvey = require('./api/routes/survey_test_api')
var testQue = require('./routes/test_ques')*/


//apis routes
var connectApiLoginRouter = require('./api/routes/connect_auth_api')
var connectQueApiRouter = require('./api/routes/connect_que_api')
var connectUsersApiRouter = require('./api/routes/connect_users_api')


var app = express();

//mongoose.connect('mongodb://127.0.0.1:27017/africaworks',{useNewUrlParser: true, useUnifiedTopology: true})

const connectDatabase = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    
 await mongoose.connect('mongodb+srv://johnecklu:sample@cluster0.ingx5.mongodb.net/forewin', {useUnifiedTopology: true});

 //await mongoose.connect('mongodb://localhost:27017/forewin', {useUnifiedTopology: true});

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();
//making the application know of passport
require('./config/passport')
require('./config/cron')
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout:'layout', extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//CORS access 
app.use((req,res, next)=>{
  //Giving access to all clients
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
      return res.status(200).json({});
  }
  next()
})

/*const corsOptions = {
  origin: 'https://main--cute-crostata-f2cd6c.netlify.app/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allow credentials (cookies, headers)
};*/



app.use(validator())
app.use(cookieParser());


app.use(session({
  secret: 'mysupersecrets',
  resave:false,
  saveUninitialized:false,
  //setting up the session store
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  //setting how long my session to live
  cookie: {maxAge: 180 * 60 * 1000}
  }));

//setting up flash after session initialize
app.use(flash())

app.use(passport.initialize())


app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')));

//setting up a middleware to handle all request
app.use(function(req,res,next){
  //creating a global variable to make available to my view
  res.locals.login = req.isAuthenticated();

  //making my session available to my view
  res.locals.session = req.session;
  res.locals.message = req.flash();
  
  next();
})



app.use('/user', usersRouter);
app.use('/', dashboard)

app.use('/users',connectUsersRouter)
app.use('/connect',connectQueRouter)
app.use('/map',mapRouter)
app.use('/report',reportRouter)
app.use('/active',activeRouter)
/*
app.use('/', indexRouter);
app.use('/connect',surveyTitleRouter)
app.use('/users',connectUsersRouter)
app.use('/questions',surveyQuestiosRouter)
app.use('/assign',surveyAssignRouter)
app.use('/answer',surveyAnswerRouter)
app.use('/chart',surveyChartRouter)
app.use('/test',testQue)*/

//APIS
/*app.use('/api/all/',surveyApiRouter)*/
app.use('/api/login/',connectApiLoginRouter)
app.use('/api/test/',connectQueApiRouter)
app.use('/api/users/',connectUsersApiRouter)


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
