const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/user_management_Db")
.then(()=> console.log("DataBase Connected"))

//------------------------------------------------------------

const express = require ('express')
const app = express()
const path = require('path')
const session = require ('express-session')
const nocache = require("nocache")
const {v4:uuidv4} = require("uuid")

app.use(nocache())

const config =require("./config/config")

//******************************* */
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized:true
}))

 app.set('view engine', 'ejs')
app.set('views',"./views/users");
// app.set('views',"./views/admin");



//----------------** for userRoutes **---------------
const userRouter = require('./routes/userRoute')
app.use('/', userRouter)
app.use('/login', userRouter)



//----------------** for Admin-Routes **---------------

const adminRouter = require('./routes/adminRoute')
app.use('/', adminRouter)
app.use('/login', adminRouter)



app.listen(3000, ()=> console.log('http://localhost:3000'))
