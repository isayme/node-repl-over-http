#!/usr/bin/env node
'use strict'

const url = require('url')
const http = require('http')
const readline = require('readline')
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

req.on('response', res => {
  res.pipe(process.stdout)
  res.on('end', function () {
    process.exit(0)
  })
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (input) => {
  req.write(input)
  req.write('\n')
})

rl.on('close', () => {
  process.exit(0)
})
