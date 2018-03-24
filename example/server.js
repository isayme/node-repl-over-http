'use strict'

const express = require('express')
const app = express()
const replOverHttp = require('../lib/repl-over-http')

const port = process.env.PORT || 8081

app.put('/repl', replOverHttp())

const server = app.listen(port, () => {
  const address = server.address()
  console.log(`Listening ${address.address}:${address.port} ...`)
})
