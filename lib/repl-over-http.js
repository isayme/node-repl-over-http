'use strict'

const repl = require('repl')
const pkg = require('../package')

const defaultWelcome = `Welcome ${pkg.name}/${pkg.version}, by ${pkg.author}.`
const defaultPrompt = '> '

const defaultPreflight = function (req) {
  const address = req.socket.remoteAddress

  if (['127.0.0.1', '::ffff:127.0.0.1'].includes(address)) {
    return true
  }
}

module.exports = function ({
  prompt = defaultPrompt,
  welcome = defaultWelcome,
  terminal = false,
  useColors = true,
  useGlobal = false,
  ignoreUndefined = false,
  preflight = defaultPreflight
} = {}) {
  if (typeof preflight !== 'function') {
    throw new Error('options.preflight should be a function')
  }

  return function replOverHTTP (req, res) {
    if (preflight(req) !== true) {
      res.statusCode = 403
      res.end('Not Allowed!')
      return
    }

    res.write(`${welcome}\n\n`)

    const replServer = repl.start({
      prompt,
      input: req,
      output: res,
      terminal,
      useColors,
      useGlobal,
      ignoreUndefined
    })

    replOverHTTP.repl = replServer

    replServer.defineCommand('whoami', {
      help: 'Display client info',
      action: function () {
        const address = `${req.socket.remoteAddress}:${req.socket.remotePort}`
        const whoami = {
          address,
          headers: req.headers
        }

        res.write(`${JSON.stringify(whoami, null, 2)}\n`)
        this.displayPrompt()
      }
    })

    const iv = setInterval(function () {
      res.write('\0')
    }, 100)

    function onEnd (reason) {
      reason = reason || '\0'
      return function () {
        clearInterval(iv)
        res.end(reason)
      }
    }

    replServer.on('exit', onEnd())
    res.connection.on('end', onEnd())
  }
}
