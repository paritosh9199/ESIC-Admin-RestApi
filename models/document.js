const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectID } = require('mongodb');

var DocumentSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
        default: 'doc',
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
    path: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    useTag: [{
        tag: {
            type: String
        }
    }]
    // link: {
    //     type: String,
    //     // required: true,
    //     trim: true,
    //     minlength: 1,
    //     validate: {
    //         validator: validator.isURL,
    //         message: '{VALUE} is not a valid URL'
    //     }
    // }

});

// DocumentSchema.methods.toJSON = function () {
//     var doc = this;
//     var docObject = doc.toObject();

//     return _.pick(docObject, ['_id', 'email']);
// };

// DocumentSchema.methods.generateAuthToken = function () {
//     var doc = this;
//     var access = 'auth';
//     var token = jwt.sign({ _id: doc._id.toHexString(), access }, process.env.JWT_SECRET).toString();

//     doc.tokens.push({ access, token });

//     return doc.save().then(() => {
//         return token;
//     });
// };


DocumentSchema.methods.addTags = function (tags) {
    var doc = this;
    for(var i = 0; i<tags.length;i++){
        var tag = tags[i];
        doc.useTag.push({ tag });
    }
    return doc.save().then(() => {
        return doc;
    });
};

DocumentSchema.statics.findBySingleToken = function (tag) {
    var doc = this;
    return doc.findOne({
        'useTag.tag': tag
    });
};

DocumentSchema.statics.findByMultipleToken = function (tags) {
    var doc = this;
    return doc.finde({
        useTag: { $all: tags }
    });
};

DocumentSchema.statics.findById = function (id) {
    var doc = this;

    return doc.findOne({
        '_id': id,
    });
};

DocumentSchema.statics.getAlldoc = function (callback) {
    var doc = this;
    doc.find({}).then((docs) => {
        callback(docs);
    }, (err) => {
        console.log('Unable to fetch doc', err);
        return err;
    });
};

DocumentSchema.statics.getCount = function (callback) {
    var doc = this;
    doc.find({}).then((docCount) => {
        callback(docCount.length);
    }, (err) => {
        console.log('Unable to fetch doc', err);
        return err;

    });
};

DocumentSchema.statics.deleteByID = function (id, callback) {
    var doc = this;
    doc.findOneAndDelete({
        _id: new ObjectID(id)
    }).then((data) => {
        callback(data);
    }, (err) => {
        console.log('Unable to delete doc', err);
        return err;
    });
};

//TODO:
// - delete by tag
// - delete by name
// - delete by date of creation


// DocumentSchema.statics.findByCredentials = function (email, password) {
//     var doc = this;

//     return doc.findOne({ email }).then((doc) => {
//         if (!doc) {
//             return Promise.reject();
//         }

//         return new Promise((resolve, reject) => {
//             // Use bcrypt.compare to compare password and doc.password
//             bcrypt.compare(password, doc.password, (err, res) => {
//                 if (res) {
//                     resolve(doc);
//                 } else {
//                     reject();
//                 }
//             });
//         });
//     });
// };

// DocumentSchema.pre('save', function (next) {
//     var doc = this;

//     if (doc.isModified('password')) {
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(doc.password, salt, (err, hash) => {
//                 doc.password = hash;
//                 next();
//             });
//         });
//     } else {
//         next();
//     }
// });

var Document = mongoose.model('Document', DocumentSchema);

module.exports = { Document }
