const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

mongoose.connect('mongodb://localhost/todo', {
  useNewUrlParser: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(
  session({
    secret: 'your secret key', // secret: 定義一組屬於你的字串做為私鑰
    resave: false,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport.js')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated // 辨識使用者是否已經登入的變數，讓 view 可以使用
  next()
})

// const Todo = require('./models/todo')

// 載入路由器
app.use('/', require('./routes/home.js'))
app.use('/todos', require('./routes/todo.js'))
app.use('/users', require('./routes/user.js'))
app.use('/auth', require('./routes/auths.js'))

app.listen(3000, () => {
  console.log('done')
})
