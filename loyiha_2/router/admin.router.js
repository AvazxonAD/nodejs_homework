const { Router } = require('express')
const router = Router()
const protect = require('../middleware/auth')
const {
    register,
    registerPost,
    login, 
    loginPost,
    add,
    addPost,
    dashboard,
    sell,
    sellPost,
    logout,
    cancel,
    allProduct,
    open,
    deleteComment,
    updateProduct,
    updateProductPost,
    deleteProduct
} = require('../controller/admin.controller')
const upload = require('../utils/uploads')

router.get('/register', register)
router.get('/login', login)
router.get('/add',protect, add)
router.get('/dashboard',protect, dashboard)
router.get('/sell/:id',protect, sell)
router.get('/logout',protect, logout)
router.get('/cancel/:id',protect, cancel)
router.get('/all/product',protect, allProduct)
router.get('/open/:id',protect, open)
router.get('/comment/delete/:id',protect, deleteComment)
router.get('/update/:id' ,protect, updateProduct)
router.get('/delete/:id',protect, deleteProduct)

router.post('/register/post', registerPost)
router.post('/login/post', loginPost)
router.post('/add/post', upload.single("image"), addPost)
router.post('/sell/post/:id', sellPost)
router.post('/update/post/:id', updateProductPost)

module.exports = router