var { User } = require('./../models/user');

var authenticate = (req, res, next) => {
    // console.log('start auth');

    var token = req.header('x-auth');
    if (!token) {
        token = req.query.xAuth;        
    }
    if (!token) {
        token = req.session.xAuth;
    }
    // console.log({"token":token});
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user.toJSON();
        req.token = token;
        next();
    }).catch((e) => {
        // res.status(401).send();
        res.redirect('/auth');
    });
};

module.exports = { authenticate };
