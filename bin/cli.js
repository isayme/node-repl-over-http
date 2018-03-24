#!/usr/bin/env node
'use strict'

const stream = require('stream')
const request = require('request')
const yargs = require('yargs')

const argv = yargs
  .option('url', {
    describe: 'specify remote url'
  })
  .demandOption(['url'])
  .help().argv

class Ping extends stream.Readable {
  constructor () {
    super()
    this.pinged = false
  }

  _read (size) {
    if (this.pinged) {
      this.push(null)
    } else {
      this.push(' ')
      this.pinged = true
    }
  }
}

const req = request({
  method: 'PUT',
  uri: argv.url
})

const ping = new Ping()
// trigger connect
ping.pipe(req, { end: false })

ping.on('end', function () {
  ping.unpipe(req)
  process.stdin.pipe(req)
})

req.pipe(process.stdout)

req.on('end', function () {
  process.exit(0)
})
