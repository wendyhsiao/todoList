const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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
    return res.render('index', { todos: todos }) // 將資料傳給 index 樣板
  })
})
app.get('/todos', (req, res) => {
  return res.redirect('/')
})
app.get('/todos/new', (req, res) => {
  res.send('新增 Todo 頁面')
})
app.post('/todos', (req, res) => {
  res.send('建立 Todo')
})
app.get('/todos/:id', (req, res) => {
  res.send('顯示一筆 Todo 的詳細內容')
})
app.get('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo 頁面')
})
app.post('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo')
})
app.get('/todos/:id', (req, res) => {
  res.send('顯示一筆todo')
})
app.post('/todos/:id/delete', (req, res) => {
  res.send('刪除 Todo')
})

app.listen(3000, () => {
  console.log('done')
})
