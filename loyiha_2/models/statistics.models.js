const mongoose = require('mongoose')

const statisticsSchema = new mongoose.Schema({
    sum : {
        type : Number,
        default : 0
    }, 
    soldOut : {
        type : Number,
        default : 0
    },
    soldNo : {
        type : Number,
        default : 0
    },
    admin : {type : mongoose.Schema.Types.ObjectId, ref : 'Admin'}
},
{timestamps : true}
)


module.exports = mongoose.model("Statistics", statisticsSchema)