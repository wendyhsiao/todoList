const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const Todo = require('./models/todo')

app.get('/', (req, res) => {
  Todo.find((err, todos) => {
    // 把 Todo model 所有的資料都抓回來
    if (err) return console.error(err)
    // console.log('todos', todos)
    return res.render('index', { todos: todos }) // 將資料傳給 index 樣板
  })
})
app.get('/todos', (req, res) => {
  return res.redirect('/')
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})
app.post('/todos', (req, res) => {
  const todo = new Todo({
    name: req.body.name
  })

  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    // console.log('req.param', req.params)
    // console.log('todo', todo)
    return res.render('detail', { todo: todo })
  })
})

app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})
app.post('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    console.log('todo', todo)
    todo.name = req.body.name
    // console.log('req.body.done', req.body.done)
    if (req.body.done === 'on') {
      todo.done = true
    } else {
      todo.done = false
    }
    todo.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/todos/${req.params.id}`)
    })
  })
})

app.post('/todos/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

app.listen(3000, () => {
  console.log('done')
})
