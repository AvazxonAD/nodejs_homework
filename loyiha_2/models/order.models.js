const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    lastName : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    region  : {
        type : String,
        required : true
    },
    product : {type : mongoose.Schema.Types.ObjectId, ref : 'Product'}
},
{timestamps : true}
)


module.exports = mongoose.model("Order", orderSchema)