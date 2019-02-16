var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    city: String,
    country: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
    dataB: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Database"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);