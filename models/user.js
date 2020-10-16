var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    topic: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email: email}).exec(function (error, user) {
        if (error) {
            return callback(error);
        } else if (!user) {
            var err = "User not found.";
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function (error, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
    });
}

UserSchema.pre("save", function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
var User = mongoose.model("User", UserSchema);
module.exports = User;