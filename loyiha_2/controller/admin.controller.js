const path = require('path')
const asyncHandler = require('../middleware/async')
const Admin = require('../models/admin.models')
const Product = require('../models/product.models')
const Order = require('../models/order.models')
const Statistics = require('../models/statistics.models')
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')
const Comment = require('../models/comment.models')

// register page 
exports.register = (req, res) => {
    res.render(path.join(__dirname, '../views/auth/register.hbs'), {
        title: 'register page',
        error: req.flash('error')
    })
}

exports.registerPost = asyncHandler(async (req, res, nex) => {
    const { email, name, lastName, password } = req.body
    if (!email || !name || !lastName || !password) {
        req.flash("error", "All surveys must be completed")
        return res.redirect('/admin/register')
    }
    const testEmail = await Admin.findOne({ email: email })
    if (testEmail) {
        req.flash("error", "Please use another email because this email is available")
        return res.redirect('/admin/register')
    }
    await Admin.create({
        email,
        name,
        lastName,
        password
    })
    return res.redirect('/admin/login')
})
// login page 
exports.login = (req, res) => {
    res.render(path.join(__dirname, '../views/auth/login.hbs'), {
        title: "login page",
        error: req.flash("error")
    })
}
// login post 
exports.loginPost = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email: email })
    if (!admin) {
        req.flash('error', "email or password error")
        return res.redirect('/admin/login')
    }
    const test = admin.matchPassword(password)
    if (!test) {
        req.flash('error', "email or password error")
        return res.redirect('/admin/login')
    }
    req.session.isAdmin = true
    req.session.admin = admin.jwtToken()
    req.session.save(err => {
        if (err) throw err
    })
    await Statistics.create({
        admin: admin._id
    })
    return res.redirect('/admin/dashboard')
})
// logout 
exports.logout = asyncHandler(async (req, res, next) => {
    req.session.destroy(err => {
        if(err) throw err
    })
    res.redirect('/admin/login')
})
// add product get 
exports.add = (req, res) => {
    res.render(path.join(__dirname, '../views/admin/add.product.hbs'), {
        title: "add product",
        error: req.flash("error"),
        isAdmin : req.session.isAdmin
    })
}

exports.addPost = asyncHandler(async (req, res, next) => {
    const { title, discr, image, amount } = req.body
    if (!title || !discr || !amount) {
        req.flash("error", "All surveys must be completed")
        return res.redirect('/admin/add')
    }
    if (amount < 1) {
        req.flash('error', "The amount should not be less than 1")
        res.redirect('/admin/add')
    }
    const admin = jwt.verify(req.session.admin, process.env.JWT_TOKEN_SECRET)

    await Product.create({
        title,
        discr,
        amount,
        image: 'uploads/' + req.file.filename,
        admin: admin.id
    })
    res.redirect('/admin/all/product')

})

// dashboard page 
exports.dashboard = asyncHandler(async (req, res, next) => {
    const admin = jwt.verify(req.session.admin, process.env.JWT_TOKEN_SECRET)
    const statistics = await Statistics.findOne({admin : admin.id}).lean()
    const ordersInfo = await Order.find().lean()
    const orders = []
    const adminName = await Admin.findById(admin.id).lean()
    statistics.name = adminName.name
    for (let order of ordersInfo) {
        const product = await Product.findOne({ _id: order.product }).lean()
        const objectId = product.admin
        if (objectId.toHexString() === admin.id) {
            product.name = order.name
            product.lastName = order.lastName
            product.phone = order.phone
            product.region = order.region
            product.date = order.createdAt
            orders.push(product)
        }
    }
    const products = await Product.find({admin : admin.id})
    let soldNo = 0
    for(let product of products){
        soldNo += product.amount
    }
    statistics.soldNo = soldNo
    res.render(path.join(__dirname, '../views/admin/dashboard.hbs'), {
        title: "admin dashboard",
        orders,
        statistics,
        isAdmin : req.session.isAdmin
    })
})
// sell product 
exports.sell = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).lean()
    res.render(path.join(__dirname, '../views/admin/sell.hbs'), {
        title: "sell info",
        product,
        error: req.flash("error"),
        isAdmin : req.session.isAdmin
    })
})
// sell post 
exports.sellPost = asyncHandler(async (req, res, next) => {
    const admin = jwt.verify(req.session.admin, process.env.JWT_TOKEN_SECRET)
    const { sum, soldOut } = req.body
    if (!sum || !soldOut) {
        req.flash('error', "All surveys must be completed")
        return res.redirect('/admin/sell/' + req.params.id)
    }
    await Statistics.findOneAndUpdate(
        { admin: admin.id },
        { 
            $inc: { sum: parseInt(sum), soldOut: parseInt(soldOut) }
        }
    );
    await Product.findByIdAndUpdate(req.params.id,
        { 
            $inc: {  amount: -parseInt(soldOut) }
        }, 
        {new : true, upsert : true}
    );
    await Order.findOneAndDelete({product : req.params.id})

    res.redirect('/admin/dashboard')
})
// cancel sell
exports.cancel = asyncHandler(async (req, res, next) => {
    await Order.findOneAndDelete({product : req.params.id})
    res.redirect('/admin/dashboard')
})

// all product 
exports.allProduct = asyncHandler(async (req, res, next) => {
    const admin = jwt.verify(req.session.admin, process.env.JWT_TOKEN_SECRET)

    const products = await Product.find({ admin: admin.id }).lean();
    
    res.render(path.join(__dirname, '../views/admin/all.product.hbs'), {
        title : "all product",
        products : products.reverse(),
        isAdmin : req.session.isAdmin,
    })
})

// open admin 
exports.open = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).lean()
    const comments = await Comment.find({product : req.params.id}).lean()
    res.render(path.join(__dirname, '../views/admin/open.admin.hbs'), {
        title : "one product",
        product,
        comments,
        isAdmin : req.session.isAdmin
    })
}) 
// delete comment 
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id)
    const product = await Product.findByIdAndUpdate(comment.product,
        { 
            $inc: {  commentLength: -1 }
        }, 
        {new : true, upsert : true}
    );
    await Comment.findByIdAndDelete(comment._id)
    res.redirect('/admin/open/' + product._id)
})
// update product 
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).lean()
    res.render(path.join(__dirname, '../views/admin/update.hbs'), {
        title : 'update product',
        error : req.flash('error'),
        product, 
        isAdmin : req.session.isAdmin
    })
}
)
// update post 
exports.updateProductPost = asyncHandler(async (req, res, next) => {
    const {title, amount, discr} = req.body
    if (amount < 1) {
        req.flash('error', "The amount should not be less than 1")
        res.redirect('/admin/update/' + req.params.id)
    }
    const product = await Product.findById(req.params.id)
    await Product.findByIdAndUpdate(product._id, {
        title : title || product.title,
        amount : amount || product.amount,
        discr : discr || product.discr
    })
    res.redirect('/admin/open/' + req.params.id)
})
// delete product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id)
    res.redirect('/admin/all/product')
})