const path = require('path')
const express = require('express')
const app = express()

app.get('/', (_, res) => res.sendFile(path.resolve('app', 'public', 'index.htm')))
app.get(/^\/favicon\.ico$/, (_, res) => res.sendStatus(200))
app.get(/^\/.+\.(css|js)$/, (req, res) => res.sendFile(path.resolve('app', 'public', req.path.substring(1))))

app.listen(55555, () => console.log('Running on: http://localhost:55555'))
