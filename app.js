require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const multer = require('multer');
const path = require('path');

var session = require('express-session');
var fs = require('fs');
var { mongoose } = require('./db/mongoose');
// var {Todo} = require('./models/todo');
var { User } = require('./models/user');
var { Notification } = require('./models/notification');
var { Image } = require('./models/images');
var { Document } = require('./models/document');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

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

    res.render('./pages/admin/login.ejs');
});
app.get('/t', function (req, res) {

    res.render('./pages/admin/template.ejs');
});
app.get('/notification.manage',authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/notfication.ejs',usr);
});
app.get('/notification.add',authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/addNotif.ejs',usr);
});
//POST getCount
app.post('/getCount', function (req, res) {
    var imgCount = 0, docCount = 0, notifCount = 0;
    Image.getCount(function (img) {
        imgCount = img;
        Notification.getCount(function(notif){
            notifCount = notif;
            Document.getCount(function(doc){
                docCount = doc;
                res.status(200).send({
                    notifCount,
                    imgCount,
                    docCount
                });
            });
        });
    });
    
});
//POST file
// multer middleware
const imgStorage = multer.diskStorage({
    destination: './public/uploads/img',
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-image-' + Date.now() + path.extname(file.originalname));
    }
});

const docStorage = multer.diskStorage({
    destination: './public/uploads/doc',
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-image-' + Date.now() + path.extname(file.originalname));
    }
});

const imgUpload = multer({
    storage: imgStorage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType('img', file, cb);
    }
}).single('myFeild');
const docUpload = multer({
    storage: docStorage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType('doc', file, cb);
    }
}).single('myFeild');

// Check File Type

function checkFileType(type, file, cb) {
    // Allowed ext
    var filetypes;
    if (type == 'img') {
        filetypes = /jpeg|jpg|png|gif/;
    } else if (type == 'doc') {
        filetypes = /doc|docx|txt|pdf|md|json/;
    } else {
        cb('Error: Invalid File');
    }
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Invalid File');
    }
}

app.get('/fileUpload/:type', (req, res) => {
    var type = req.params.type;
    res.render('./pages/admin/file', { type })
});

app.post('/fileUpload/:type', (req, res) => {
    var type = req.params.type;
    if (type == 'img') {
        imgUpload(req, res, (err) => {
            console.log(req.file);
            if (err) {
                res.render('./pages/admin/file', {
                    msg: err,
                    type
                });
            } else {
                if (req.file == undefined) {
                    res.render('./pages/admin/file', {
                        msg: 'Error: No File Selected!',
                        type
                    });
                } else {
                    var tags = ["tag1", "tag2"];
                    var data = {
                        name: req.file.originalname,
                        type: req.file.mimetype,
                        createdOn: Date.now(),
                        path: `/uploads/img/${req.file.filename}`
                    }
                    var image = new Image(data);
                    image.save().then(function (data) {
                        image.addTags(tags);
                        res.render('./pages/admin/file', {
                            msg: 'File Uploaded!',
                            file: `/uploads/img/${req.file.filename}`,
                            type
                        });
                    });

                }
            }
        });
    } else if (type == 'doc') {
        docUpload(req, res, (err) => {
            console.log(req.file);
            if (err) {
                res.render('./pages/admin/file', {
                    msg: err,
                    type
                });
            } else {
                if (req.file == undefined) {
                    res.render('./pages/admin/file', {
                        msg: 'Error: No File Selected!',
                        type
                    });
                } else {
                    var data = {
                        name: req.file.originalname,
                        type: req.file.mimetype,
                        createdOn: Date.now(),
                        path: `/uploads/doc/${req.file.filename}`
                    }
                    var doc = new Document(data);
                    doc.save().then(function (data) {
                        // docs.addTags(tags);
                        res.render('./pages/admin/file', {
                            msg: 'File Uploaded!',
                            file: `/uploads/doc/${req.file.filename}`,
                            type
                        });
                    });

                }
            }
        });
    } else {
        res.send('invalid');
    }
});

app.get('/fileRead/:type', function (req, res) {
    var type = req.params.type;
    var id = req.body.id;
    if (type == 'img') {
        Image.getAllimage(function (img) {
            try {
                res.status(200).send(img);
            } catch (e) {
                res.status(400).send(e);
            }
        });
    } else if (type == 'doc') {
        Document.getAlldoc(function (doc) {
            try {
                res.status(200).send(doc);
            } catch (e) {
                res.status(400).send(e);
            }
        });
    } else if (type == 'vid') {

    } else {
        res.send('invalid');
    }
});

app.post('/fileDelete/:type', function (req, res) {
    var type = req.params.type;
    var id = req.body.id;
    if (type == 'img') {
        Image.deleteByID(id, function (docs) {
            try {
                // fs.unlink(docs.path);
                res.status(200).send(docs);
            } catch (error) {
                console.log(error)
                res.status(400).send(error);
            }
        });
    } else if (type == 'doc') {
        Document.deleteByID(id, function (docs) {
            try {
                // fs.unlink(docs.path);
                res.status(200).send(docs);
            } catch (error) {
                console.log(error)
                res.status(400).send(error);
            }
        });
    } else if (type == 'vid') {
        //todo make video
    } else {
        res.send('invalid');
    }
});



//POST notif
app.post('/createNotif', function (req, res) {

    var body = _.pick(req.body, ['content', 'link']);
    var notif = new Notification(body);
    notif.save().then(() => {
        res.send({ success: true });
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.post('/deleteNotif', function (req, res) {
    var body = _.pick(req.body, ['id']);
    Notification.deleteByID(body.id, function (docs) {
        try {
            res.status(200).send(docs);
        } catch (error) {
            console.log(error)
            res.status(400).send(error);
        }
    });
})

app.get('/readNotif', function (req, res) {
    Notification.getAllNotification(function (docs) {
        try {
            res.status(200).send(docs);
        } catch (e) {
            res.status(400).send(e);
        }
    })
})

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
    res.render("./pages/admin/indexAdmin", usr);
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