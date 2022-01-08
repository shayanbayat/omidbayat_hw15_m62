const express = require('express')
const { join } = require('path')
const router = require('./routs/router')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')

// create express app
const MongoDBURI = "mongodb://localhost:27017/sessions"
const app = express()
const PORT = 5500
//mongodb session
const store = new MongoDBSession({
    uri:MongoDBURI,
    collection: "mySession",
})
//session
app.use(
    session({
        secret:"key will cookie",
        resave: false,
        saveUninitialized:false,
        store:store
    })
)
//database

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
};
 mongoose.connect(MongoDBURI).then((res)=>{
     console.log("connected mongodb")
 })






// set ejs engine
app.use(expressLayouts)
app.set('layout','./layouts/main')
app.set('view engine', 'ejs')
app.set('views', join(__dirname, './views'))

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// serve public files
app.use(express.static(join(__dirname, 'public')))

// router
app.use("/",router)

app.listen(PORT, () => console.log(`Server is running on port:${PORT}`))