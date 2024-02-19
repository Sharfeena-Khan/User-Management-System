const express = require('express')
const user_route = express.Router()
const session = require ( 'express-session')

const nocach = require("nocache")

const userController = require('../controllers/userController')


user_route.use(nocach())

user_route.get('/', userController.loadRegister)
user_route.get('/register', userController.loadRegister)


user_route.post('/register', userController.insertUser)


user_route.get('/', userController.loadLogin)
user_route.get('/login',userController.loadLogin)

user_route.post('/login',userController.verifyLogin)

user_route.get('/', userController.loadHome)
user_route.get('/home', userController.loadHome)

user_route.get('/logout',userController.logout)



module.exports = user_route