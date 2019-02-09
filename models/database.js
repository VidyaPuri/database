var mongoose = require("mongoose");

var databaseSchema = mongoose.Schema({
    month: String,
    year: Number,
    rate: Number,
    bonus: Number,
    vacation: Number,
    workdays: Number,
    netdays: Number,
    workhours: Number,
    payement: Number,
    //description: String,
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