const path = require('path')
const asyncHandler = require('../middleware/async')
const Product = require('../models/product.models')
const Comment = require('../models/comment.models')
const Order = require('../models/order.models')

// user home page 
exports.home = asyncHandler(async (req, res, next) => {
    const products = await Product.find().lean()
    res.render(path.join(__dirname, '../views/user/home.hbs'), {
        title : "home page",
        products : products.reverse(),
        isAdmin : req.session.isAdmin
    })
})
// single product open 
exports.open = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({_id : req.params.id}).lean()
    const comments = await Comment.find({product : req.params.id}).lean()
    res.render(path.join(__dirname, '../views/user/open.hbs'), {
        title : "single product",
        product,
        error : req.flash("error"),
        comments : comments.reverse(),
        isAdmin : req.session.isAdmin
    })
})
// add comment post
exports.addCommentPost = asyncHandler(async (req, res, next) => {
    const {email, comment} = req.body
    if(!email || !comment){
        req.flash('error', 'All requests must be stated')
        return res.redirect('/user/open/' + req.params.id)
    }
    const newComment = await Comment.create({
        email,
        comment,
        product : req.params.id
    })
    await Product.findByIdAndUpdate(req.params.id,
        { $inc: {  commentLength: 1 }},
        {new : true, upsert : true}
    )
    return res.redirect('/user/open/' + req.params.id)
})
// order page 
exports.order = asyncHandler( async (req, res, next) => {
    const product = await Product.findOne({_id : req.params.id}).lean()
    amount = product.amount > 0
    res.render(path.join(__dirname, '../views/user/order.hbs'), {
        title : 'order',
        error : req.flash("error"),
        product,
        amount,
        isAdmin : req.session.isAdmin
    })
})
// order post 
exports.orderPost = asyncHandler(async (req, res, next) => {
    const {lastName, name, phone, region} = req.body
    console.log(req.body)
    if(!lastName || !name || !phone || !region){
        req.flash("error", "All surveys must be completed")
        return res.redirect('/user/order/' + req.params.id)
    }
    const order = await Order.create({
        lastName,
        name,
        phone,
        region,
        product : req.params.id
    })
    await Product.findOneAndUpdate({_id : req.params.id}, 
        {$push : {order : order._id}},
        {new : true, upsert : true}
        )
    return res.redirect('/user/')
})