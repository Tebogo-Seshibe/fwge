const express = require('express')
const path = require('path')
const app = express()

app.get('/', (_req, res) => res.sendFile(path.resolve(__dirname, './public/index.html')))
app.get('/system.js', (_req, res) => res.sendFile(path.resolve(__dirname, 'public', 'system.js')))
app.get(/\/.+\.js/, (req, res) => { var p = path.resolve(__dirname, '..', 'build', req.url.substring(1)); console.log(p); res.sendFile(p)})
app.get('/favicon.ico', (_req, res) => res.sendStatus(200))
app.get(/\/*/, (req, res) => res.sendFile(path.resolve(__dirname, 'public', req.url.substring(1))))

app.listen(5555)