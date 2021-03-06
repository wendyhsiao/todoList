const express = require('express')
const router = express.Router()
const Todo = require('../models/todo.js')
const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  Todo.find({ userId: req.user._id }) // 只會列出登入使用者的 todo
    .sort({ name: 'asc' })
    .exec((err, todos) => {
      // 把 Todo model 所有的資料都抓回來
      if (err) return console.error(err)
      // console.log('todos', todos)
      return res.render('index', { todos: todos }) // 將資料傳給 index 樣板
    })
})

module.exports = router
