
const router = require('express').Router()

const { logIn, signup } = require('../auth/authController');



router.post('/login', logIn)

module.exports = router