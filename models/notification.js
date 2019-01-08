const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {MongoClient, ObjectID} = require('mongodb');

var NotificationSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    createdOn: {
        type: Number,
        required: true,
        default: Date.now(),
        minlength: 1,
        trim: true
    },
    expireOn: {
        type: Number,
        required: true,
        default: Date.now() + 8640000000,
        minlength: 1,
        trim: true
    },
    link: {
        type: String,
        // required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isURL,
            message: '{VALUE} is not a valid URL'
        }
    }

});

// NotificationSchema.methods.toJSON = function () {
//     var notif = this;
//     var notifObject = notif.toObject();

//     return _.pick(notifObject, ['_id', 'email']);
// };

// NotificationSchema.methods.generateAuthToken = function () {
//     var notif = this;
//     var access = 'auth';
//     var token = jwt.sign({ _id: notif._id.toHexString(), access }, process.env.JWT_SECRET).toString();

//     notif.tokens.push({ access, token });

//     return notif.save().then(() => {
//         return token;
//     });
// };

NotificationSchema.statics.deleteNotif = function (id) {
    var notif = this;

    return notif.findOneAndDelete({
        _id: id
    }).then((result) => {
        // console.log(result);
    });
};


NotificationSchema.statics.findById = function (id) {
    var notif = this;

    return notif.findOne({
        '_id': id,
    });
};

NotificationSchema.statics.getAllNotification = function (callback) {
    var notif = this;
    notif.find({}).then((docs) => {
        callback(docs);
    }, (err) => {
        console.log('Unable to fetch notifications', err);
        return err;
    });
};

NotificationSchema.statics.getCount = function (callback) {
    var notif = this;
    notif.find({}).then((notifCount) => {
        callback(notifCount.length);
    }, (err) => {
        console.log('Unable to fetch notifications', err);
        return err;
       
    });
};

NotificationSchema.statics.deleteByID = function (id,callback) {
    var notif = this;
    notif.findOneAndDelete({
        _id:    new ObjectID(id)
    }).then((data) => {
        callback(data);
    }, (err) => {
        console.log('Unable to delete notifications', err);
        return err;      
    });
};

// NotificationSchema.statics.findByCredentials = function (email, password) {
//     var notif = this;

//     return notif.findOne({ email }).then((notif) => {
//         if (!notif) {
//             return Promise.reject();
//         }

//         return new Promise((resolve, reject) => {
//             // Use bcrypt.compare to compare password and notif.password
//             bcrypt.compare(password, notif.password, (err, res) => {
//                 if (res) {
//                     resolve(notif);
//                 } else {
//                     reject();
//                 }
//             });
//         });
//     });
// };

// NotificationSchema.pre('save', function (next) {
//     var notif = this;

//     if (notif.isModified('password')) {
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(notif.password, salt, (err, hash) => {
//                 notif.password = hash;
//                 next();
//             });
//         });
//     } else {
//         next();
//     }
// });

var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification }
