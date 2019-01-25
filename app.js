var { env } = require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const multer = require('multer');
const path = require('path');

var cors = require('cors');
var session = require('express-session');
var fs = require('fs');
var { mongoose } = require('./db/mongoose');
// var {Todo} = require('./models/todo');
var { User } = require('./models/user');
var { Notification } = require('./models/notification');
var { Image } = require('./models/images');
var { Document } = require('./models/document');
var { authenticate } = require('./middleware/authenticate');

var whitelist = ['http://esichyd.herokuapp.com/', 'http://localhost:5000/*']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use(cors());
// cors(corsOptions)
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
    res.redirect('/auth');
});


app.get('/mobile', function (req, res) {
    res.render('./pages/admin/mobile.ejs');
});


app.get('/login', function (req, res) {

    res.redirect('/auth');
    // res.render('./pages/admin/login.ejs');
});
app.get('/auth', function (req, res) {

    res.render('./pages/admin/auth.ejs');
});
app.get('/t', function (req, res) {

    res.render('./pages/admin/template.ejs');
});
app.get('/notifications.manage', authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/notfication.ejs', usr);
});
app.get('/notifications.add', authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/addNotif.ejs', usr);
});
app.get('/images.manage', authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/images.ejs', usr);
});
app.get('/images.add', authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/addImages.ejs', usr);
});

app.get('/documents.manage', authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/documents.ejs', usr);
});
app.get('/documents.add', authenticate, function (req, res) {

    var usr = {
        "user": req.user
    }
    // res.render('./pages/admin/login.ejs');

    res.render('./pages/admin/addDocuments.ejs', usr);
});


//POST getCount
app.post('/getCount', function (req, res) {
    var imgCount = 0, docCount = 0, notifCount = 0;
    Image.getCount(function (img) {
        imgCount = img;
        Notification.getCount(function (notif) {
            notifCount = notif;
            Document.getCount(function (doc) {
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
    limits: { fileSize: 6291457 },
    fileFilter: function (req, file, cb) {
        checkFileType('img', file, cb);
    }
}).single('fileFeild');
const docUpload = multer({
    storage: docStorage,
    limits: { fileSize: 6291457 },
    fileFilter: function (req, file, cb) {
        checkFileType('doc', file, cb);
    }
}).single('fileFeild');

// Check File Type

function checkFileType(type, file, cb) {
    // Allowed ext
    var filetypes;
    if (type == 'img') {
        filetypes = /jpeg|jpg|png|gif/;
    } else if (type == 'doc') {
        filetypes = /doc|docx|txt|pdf|md/;
    } else {
        cb('Error: Invalid File');
    }
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime

    var mimetype = filetypes.test(file.mimetype);
    mimetype = true;
    // console.log({extname,mimetype,mimetype:file.mimetype})

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
                res.send({
                    success: false,
                    msg: err,
                    type
                });
            } else {
                if (req.file == undefined) {
                    res.send({
                        success: false,
                        msg: 'Error: No File Selected!',
                        type
                    });
                } else {
                    // var tags = ["tag1", "tag2"];
                    var tags = _.pick(req.body, ['tags']);
                    var data = {
                        name: req.file.originalname,
                        type: req.file.mimetype,
                        size: req.file.size,
                        createdOn: Date.now(),
                        path: `/uploads/img/${req.file.filename}`
                    }
                    var image = new Image(data);
                    image.save().then(function (data) {
                        console.log(tags)
                        image.addTags(tags);
                        res.send({
                            id: data._id,
                            success: true,
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
            // console.log(req.document);
            // console.log(req.body);
            // console.log(req.body.tags);

            console.log('//==========================================')
            // console.log({req});
            if (err) {
                res.send({
                    msg: err,
                    type,
                    success: false
                });
            } else {
                if (req.file == undefined) {
                    res.send({
                        msg: 'Error: No File Selected!',
                        type,
                        success: false
                    });
                } else {
                    var data = {
                        name: req.file.originalname,
                        type: req.file.mimetype,
                        size: req.file.size,
                        createdOn: Date.now(),
                        path: `/uploads/doc/${req.file.filename}`
                    }
                    var doc = new Document(data);
                    doc.save().then(function (data) {
                        // doc.addTags(tags);
                        res.send({
                            id: data._id,
                            success: true,
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

app.post('/addTagFile/:type', (req, res) => {
    var type = req.params.type;
    var id = req.body.id;
    var tags = req.body.tags;
    if (type == 'img') {
        Image.addTagsById(id, tags, function (img) {
            res.status(200).send(img);
        });
    } else if (type == 'doc') {
        Document.addTagsById(id, tags, function (doc) {
            res.status(200).send(doc);
        });
    } else {
        res.send('invalid');
    }
});


app.get('/fileRead/:type',cors(), function (req, res) {
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
        res.send('vid');
    } else {
        res.send('invalid');
    }
});

app.get('/getFileByTag/:type/:tag',cors(), function () {
    var type = req.params.type;
    var id = req.body.id;
    if (type == 'img') {
        // Image.getAllimage(function (img) {
        //     try {
        //         res.status(200).send(img);
        //     } catch (e) {
        //         res.status(400).send(e);
        //     }
        // });
    } else if (type == 'doc') {
        // Document.getAlldoc(function (doc) {
        //     try {
        //         res.status(200).send(doc);
        //     } catch (e) {
        //         res.status(400).send(e);
        //     }
        // });
    } else if (type == 'vid') {
        // res.send('vid');
    } else {
        // res.send('invalid');
    }
})
app.post('/fileDelete/:type', function (req, res) {
    var type = req.params.type;
    var id = req.body.id;
    if (type == 'img') {
        Image.deleteByID(id, function (docs) {
            try {
                fs.unlink('./public' + docs.path, function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).send({success:false});
                    }
                    res.status(200).send(docs);
                });
            } catch (error) {
                console.log(error)
                res.status(400).send(error);
            }
        });
    } else if (type == 'doc') {
        Document.deleteByID(id, function (docs) {
            try {
                fs.unlink('./public' + docs.path, function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).send({success:false});
                    }
                    res.status(200).send(docs);
                });
                // console.log(docs.path);

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
app.post('/createNotif', authenticate, function (req, res) {

    var body = _.pick(req.body, ['content', 'link', 'expireOn']);
    var notif = new Notification(body);
    notif.save().then(() => {
        res.send({ success: true });
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

app.post('/deleteNotif', authenticate, function (req, res) {
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

app.get('/readNotif',cors(), function (req, res) {
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
    // console.log({ "body": req.body, "query": req.query });

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            req.session.xAuth = token;
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send("Invalid login credentials");
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
    console.log(`Started up at port: ${port}, environment: ${env}`);
});