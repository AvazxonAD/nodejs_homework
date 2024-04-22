const protect = (req, res, next) => {
    if(!req.session.isAdmin){
        return res.redirect('/user/')
    }
    next()
}

module.exports = protect