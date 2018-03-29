'use strict'

const http = require('http')
const assert = require('assert')
const crypto = require('crypto')
const supertest = require('supertest')
const replOverHttp = require('../lib/repl-over-http')

describe('REPL over HTTP(s)', function () {
  describe('whoami', function () {
    let server = http.createServer(
      replOverHttp({ welcome: '', useColors: false })
    )

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
    let server = http.createServer(
      replOverHttp({ welcome: '', useColors: false })
    )

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

  describe('options.preflight', function () {
    let server = http.createServer(
      replOverHttp({ welcome: '', useColors: false, preflight: () => false })
    )

    it('should reject', function (done) {
      const randomMsg = crypto.randomBytes(4).toString('hex')

      supertest(server)
        .put('/')
        .send(`console.log("${randomMsg}")\n`)
        .end(function (err, res) {
          assert.equal(err, null)
          assert.equal(res.statusCode, 403)
          assert.equal(res.text, 'Not Allowed!')
          done()
        })
    })
  })
})
