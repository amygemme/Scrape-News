var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NPRSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var NPRnews = mongoose.model("NPR", NPRSchema);

module.exports = NPRnews;