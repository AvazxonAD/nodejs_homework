const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    discr : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    commentLength : {
        type : Number,
        default : 0
    },
    comment : [{type : mongoose.Schema.Types.ObjectId, ref : 'Comment'}],
    order : [{type : mongoose.Schema.Types.ObjectId, ref : 'Order'}],
    admin : {type : mongoose.Schema.Types.ObjectId, ref : 'Admin'}
},
{timestamps : true}
)


module.exports = mongoose.model("Product", productSchema)