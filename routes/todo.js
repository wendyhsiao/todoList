const express = require('express')
const router = express.Router()
const Todo = require('../models/todo.js')
const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  return res.redirect('/')
})

router.get('/new', authenticated, (req, res) => {
  res.render('new')
})
router.post('/', authenticated, (req, res) => {
  const todo = new Todo({
    name: req.body.name,
    userId: req.user._id
  })

  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

router.get('/:id', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    if (err) return console.error(err)
    // console.log('req.param', req.params)
    // console.log('todo', todo)
    return res.render('detail', { todo: todo })
  })
})

router.get('/:id/edit', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})
router.put('/:id', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
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

router.delete('/:id/delete', authenticated, (req, res) => {
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
