const express = require('express')
const router = express.Router()
const Todo = require('../models/todo.js')

router.get('/', (req, res) => {
  return res.redirect('/')
})

router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', (req, res) => {
  const todo = new Todo({
    name: req.body.name
  })

  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

router.get('/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    // console.log('req.param', req.params)
    // console.log('todo', todo)
    return res.render('detail', { todo: todo })
  })
})

router.get('/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})
router.put('/:id', (req, res) => {
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

router.delete('/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
