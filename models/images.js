const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {MongoClient, ObjectID} = require('mongodb');

var ImageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        default:'image',
        trim: true,
        minlength: 1
    },
    type: {
        type: String,
        required: true,
        default:'image',
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
            type: String,
            // required: true,
            default:"image"
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

// ImageSchema.methods.toJSON = function () {
//     var image = this;
//     var imageObject = image.toObject();

//     return _.pick(imageObject, ['_id', 'email']);
// };

// ImageSchema.methods.generateAuthToken = function () {
//     var image = this;
//     var access = 'auth';
//     var token = jwt.sign({ _id: image._id.toHexString(), access }, process.env.JWT_SECRET).toString();

//     image.tokens.push({ access, token });

//     return image.save().then(() => {
//         return token;
//     });
// };



ImageSchema.statics.findById = function (id) {
    var image = this;

    return image.findOne({
        '_id': id,
    });
};

ImageSchema.statics.getAllimage = function (callback) {
    var image = this;
    image.find({}).then((docs) => {
        callback(docs);
    }, (err) => {
        console.log('Unable to fetch image', err);
        return err;
    });
};

ImageSchema.statics.getCount = function (callback) {
    var image = this;
    image.find({}).then((imageCount) => {
        callback(imageCount.length);
    }, (err) => {
        console.log('Unable to fetch image', err);
        return err;
       
    });
};

ImageSchema.statics.deleteByID = function (id,callback) {
    var image = this;
    image.findOneAndDelete({
        _id:    new ObjectID(id)
    }).then((data) => {
        callback(data);
    }, (err) => {
        console.log('Unable to delete image', err);
        return err;      
    });
};

//TODO:
// - delete by tag
// - delete by name
// - delete by date of creation


// ImageSchema.statics.findByCredentials = function (email, password) {
//     var image = this;

//     return image.findOne({ email }).then((image) => {
//         if (!image) {
//             return Promise.reject();
//         }

//         return new Promise((resolve, reject) => {
//             // Use bcrypt.compare to compare password and image.password
//             bcrypt.compare(password, image.password, (err, res) => {
//                 if (res) {
//                     resolve(image);
//                 } else {
//                     reject();
//                 }
//             });
//         });
//     });
// };

// ImageSchema.pre('save', function (next) {
//     var image = this;

//     if (image.isModified('password')) {
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(image.password, salt, (err, hash) => {
//                 image.password = hash;
//                 next();
//             });
//         });
//     } else {
//         next();
//     }
// });

var Image = mongoose.model('Image', ImageSchema);

module.exports = { Image }
