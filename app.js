require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var session = require('express-session')
var { mongoose } = require('./db/mongoose');
// var {Todo} = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))



app.get('/', function (req, res) {
  res.redirect('/login');
});

app.get('/login', function (req, res) {

  res.render('./pages/login.ejs');
});

// POST /users
app.post('/register', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    req.session.xAuth = token;
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/me', authenticate, (req, res) => {
  var usr = {
    "user": req.user
  }
  // res.send(user);
  // console.log(user);
  res.render("./pages/dash.ejs", usr);
});

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  console.log({ "body": req.body, "query": req.query });

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      req.session.xAuth = token;
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});


app.post('/logout', authenticate, (req, res) => {
  User.removeToken(req.token).then(() => {
    // res.status(200).send();
    req.session.destroy();

    res.redirect('/login');
  }, () => {
    res.status(400).send('Bad request');
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});