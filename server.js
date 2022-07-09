if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser =  require('body-parser')
const methodOverride = require('method-override')
const path = require('path')

const indexRouter = require('./routes/index')
const actRouter = require('./routes/actividad')
const cultRouter = require('./routes/cultivo')
const areaRouter = require('./routes/area')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended: false }))
app.use(express.json())

app.use((req,res,next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

//base de datos

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado a Mongoose'))


app.use('/', indexRouter)

app.use('/actividad', actRouter)


app.use('/cultivo', cultRouter)


app.use('/area', areaRouter)

console.log('error')



app.listen(process.env.PORT || 4000)