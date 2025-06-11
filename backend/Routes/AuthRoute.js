const { Signup, Login } = require('../Controllers/AuthController')
const {userVerification} = require('../Middlewares/AuthMiddleware')
const router = require('express').Router()

router.post('/signup', Signup)
router.post('/login', Login)
router.post('/',userVerification)
router.get("/", (req, res) => {
  res.send("GET request received at /");
});

module.exports = router