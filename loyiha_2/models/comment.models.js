const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    product : {type : mongoose.Schema.Types.ObjectId, ref : 'Product'}
},
{timestamps : true}
)


module.exports = mongoose.model("Comment", commentSchema)