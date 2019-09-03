const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('HELLo')
})

app.listen(3000, () => {
  console.log('done')
})
