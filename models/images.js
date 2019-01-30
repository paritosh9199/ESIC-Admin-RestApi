const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectID } = require('mongodb');

var ImageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        default: 'image',
        trim: true,
        minlength: 1
    },
    type: {
        type: String,
        required: true,
        default: 'image',
        trim: true,
        minlength: 1
    },
    size:{
        type: Number,
        required:true,
        minlength:1,
        trim:true
    },
    createdOn: {
        type: Number,
        required: true,
        default: Date.now(),
        minlength: 1,
        trim: true
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    path: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    // tags: [{
    //     tag: {
    //         type: String,
    //         // required: true,
    //         default:"image"
    //     }
    // }],

    tags: [{
        tag: {
            type: String,
            // required: true
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

ImageSchema.methods.addTags = function (tags) {
    var image = this;
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        image.tags.push({ tag });
    }
    return image.save().then(() => {
        return image;
    });
};

ImageSchema.statics.addTagsById = function (id,tags,callback) {
    var Img = this;
    Img.findOne({
        '_id': id,
    }).then(function(img){
        for(var i = 0; i<tags.length;i++){
            var tag = tags[i];
            img.tags.push({ tag });
        }
        img.save().then(() => {
            callback(img)
        });
        // return img;
    });
};



ImageSchema.statics.findBySingleTag = function (tag) {
    var image = this;
    return Image.find({
        'tags.tag': tag
    });
};


ImageSchema.statics.findByMultipleTag = function (tags) {
    var image = this;
    return Image.find({
        tags: { $all: tags }
    });
};

ImageSchema.statics.findById = function (id) {
    var image = this;

    return image.findOne({
        '_id': id,
    });
};

ImageSchema.statics.getAllimage = function (callback) {
    var image = this;
    image.find({}).then((img) => {
        callback(img);
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

ImageSchema.statics.deleteByID = function (id, callback) {
    var image = this;
    image.findOneAndDelete({
        _id: new ObjectID(id)
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
