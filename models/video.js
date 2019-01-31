const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectID } = require('mongodb');

var VideoSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        default: 'doc',
        trim: true,
        minlength: 1
    },
    type: {
        type: String,
        required: true,
        default: 'vid',
        trim: true,
        minlength: 1
    },
    duration:{
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
    videoLink: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isURL,
            message: '{VALUE} is not a valid URL'
        }
    },
    tags: [{
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

// VideoSchema.methods.toJSON = function () {
//     var doc = this;
//     var docObject = doc.toObject();

//     return _.pick(docObject, ['_id', 'email']);
// };

// VideoSchema.methods.generateAuthToken = function () {
//     var doc = this;
//     var access = 'auth';
//     var token = jwt.sign({ _id: doc._id.toHexString(), access }, process.env.JWT_SECRET).toString();

//     doc.tokens.push({ access, token });

//     return doc.save().then(() => {
//         return token;
//     });
// };


VideoSchema.methods.addTags = function (tags) {
    var vid = this;
    for(var i = 0; i<tags.length;i++){
        var tag = tags[i];
        vid.tags.push({ tag });
    }
    return vid.save().then(() => {
        return vid;
    });
};

VideoSchema.statics.addTagsById = function (id,tags,callback) {
    var vid = this;
    vid.findOne({
        '_id': id,
    }).then(function(vid){
        for(var i = 0; i<tags.length;i++){
            var tag = tags[i];
            vid.tags.push({ tag });
        }
        vid.save().then(() => {
            callback(vid)
        });
        // return vid;
    });    
};


VideoSchema.statics.findBySingleTag = function (tag) {
    var vid = this;
    return vid.find({
        'tags.tag': tag
    });
};

VideoSchema.statics.findByMultipleTags = function (tags) {
    var vid = this;
    return vid.find({
        tags: { $all: tags }
    });
};

VideoSchema.statics.findById = function (id) {
    var vid = this;

    return vid.findOne({
        '_id': id,
    });
};

VideoSchema.statics.getAllvid = function (callback) {
    var vid = this;
    vid.find({}).then((vids) => {
        callback(vids);
    }, (err) => {
        console.log('Unable to fetch vid', err);
        return err;
    });
};

VideoSchema.statics.getCount = function (callback) {
    var vid = this;
    vid.find({}).then((vidCount) => {
        callback(vidCount.length);
    }, (err) => {
        console.log('Unable to fetch vid', err);
        return err;

    });
};

VideoSchema.statics.deleteByID = function (id, callback) {
    var vid = this;
    vid.findOneAndDelete({
        _id: new ObjectID(id)
    }).then((data) => {
        callback(data);
    }, (err) => {
        console.log('Unable to delete vid', err);
        return err;
    });
};



var Video = mongoose.model('Video', VideoSchema);

module.exports = { Video }
