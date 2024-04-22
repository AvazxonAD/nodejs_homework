const {Router} = require('express')
const router = Router()

const {home, open, addCommentPost, order, orderPost} = require('../controller/user.controller')

router.get('/', home)
router.get('/open/:id', open)
router.get("/order/:id", order)


router.post('/comment/:id', addCommentPost )
router.post("/order/post/:id", orderPost)

module.exports = router