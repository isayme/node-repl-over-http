#!/usr/bin/env node
'use strict'

const url = require('url')
const http = require('http')
const yargs = require('yargs')

const argv = yargs
  .option('url', {
    describe: 'specify remote url'
  })
  .demandOption(['url'])
  .help().argv

const opts = url.parse(argv.url)
opts.method = 'PUT'
opts.headers = {
  Expect: '100-continue'
}
const req = http.request(opts)

process.stdin.pipe(req)

req.on('response', res => {
  res.pipe(process.stdout)
  res.on('end', function () {
    process.exit(0)
  })
})
