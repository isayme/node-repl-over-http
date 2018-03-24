'use strict'

const http = require('http')
const assert = require('assert')
const crypto = require('crypto')
const supertest = require('supertest')
const replOverHttp = require('../lib/repl-over-http')

describe('REPL over HTTP(s)', function () {
  let server = http.createServer(
    replOverHttp({ welcome: '', useColors: false })
  )

  describe('whoami', function () {
    it('should ok', function (done) {
      supertest(server)
        .put('/')
        .send('.whoami\n')
        .end(function (err, res) {
          assert.equal(err, null)
          assert.ok(res.text.indexOf('"address"') >= 0)
          assert.ok(res.text.indexOf('"headers"') >= 0)
          done()
        })
    })
  })

  describe('command', function () {
    it('console.log', function (done) {
      const randomMsg = crypto.randomBytes(4).toString('hex')

      supertest(server)
        .put('/')
        .send(`console.log("${randomMsg}")\n`)
        .end(function (err, res) {
          assert.equal(err, null)
          assert.ok(res.text.indexOf(randomMsg) >= 0)
          done()
        })
    })
  })
})
