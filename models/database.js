var mongoose = require("mongoose");

var databaseSchema = mongoose.Schema({
    month: String,
    year: Number,
    date: String,
    rate: Number,
    bonus: Number,
    vacation: Number,
    sickleave: Number,
    workdays: Number,
    netdays: Number,
    workhours: Number,
    payement: Number,
    userid: mongoose.SchemaTypes.ObjectId, 
    createdAt: { type: Date, default: Date.now },
    // owner: {
    //     id: {
    //         type: mongoose.SchemaTypes.ObjectId,
    //         ref: "User",
    //     },
    //     username: String
    // }
});

module.exports = mongoose.model("Database", databaseSchema);