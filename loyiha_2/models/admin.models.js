const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const adminSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    statistics : {type : mongoose.Schema.Types.ObjectId, ref : 'Statistics'},
    product : [{type : mongoose.Schema.Types.ObjectId, ref : 'Product'}]
}, {timestamps : true}
)

// hashing password 
adminSchema.pre('save', async function(next) {
    if (!this.isModified) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// match password 
adminSchema.methods.matchPassword = async function(parol) {
    return await bcrypt.compare(parol, this.password)
}
// jwt  token  
adminSchema.methods.jwtToken = function() {
    return jwt.sign({id : this._id, name : this.name}, process.env.JWT_TOKEN_SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    })
} 

module.exports = mongoose.model("Admin", adminSchema)