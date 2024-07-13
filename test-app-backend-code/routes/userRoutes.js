
const router = require('express').Router()

const { authorization } = require('../auth/authController')

const userController = require('../controllers/userController')

router.get('/getAll', userController.getAllUsers)

router.get('/getSingleUser/:id', userController.getSingleUser)

router.post('/addUser', authorization, userController.createUser)

router.put('/updateUser/:id', authorization, userController.updateUser)

router.delete('/deleteUser/:id', authorization, userController.deleteUser)

module.exports = router