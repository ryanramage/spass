#!/usr/bin/env node
var readline = require('readline')

var pw = require('pw')
var async = require('async')
var argparse = require('argparse')
var onWakeup = require('on-wakeup')
var baseEmoji = require('base-emoji')
var crypto = require('crypto')
var toClipboard = require('to-clipboard-android')
var supergenpass = require('supergenpass')

var cfg = require('./package.json')

var parser = new argparse.ArgumentParser({
  version: cfg.version,
  addHelp: true,
  description: cfg.description
})

parser.addArgument(['-l', '--length'], {
  defaultValue: 10,
  help: 'Length of the generated password',
  type: 'int'
})
parser.addArgument(['-m', '--method'], {
  choices: ['md5', 'sha512'],
  defaultValue: 'md5',
  help: 'Hash function to use',
  type: 'string'
})
parser.addArgument(['--keepSubdomains'], {
  action: 'storeTrue',
  default: false,
  help: 'Do not perform subdomain removal'
})
parser.addArgument(['--secret'], {
  defaultValue: '',
  help: 'Additional secret password'
})
var args = parser.parseArgs()

onWakeup(function () {
  console.log('\nDevice sleep detected, exiting!')
  process.exit(0)
})

process.stderr.write('Master password: ')

pw('', function (password) {
  if (!password.length) process.exit(1)

  // print out 5 emoji from a md5 hash
  var buf = new Buffer(password, 'utf8')
  var bits = crypto.createHash('md5').update(buf).digest('hex')
  var parts = []
  for (var i = 0; i < 5; i++) {
    var bit = bits.slice(i, i + 1)
    var pic = baseEmoji.toUnicode(new Buffer(bit, 'utf8'))
    parts.push(pic)
  }
  console.log('emoji confirmation: ' + parts.join('  '))

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  var processor = function (done) {
    geturl(rl, function (url) {
      supergenpass(password, url, {
        length: args.length,
        method: args.method,
        removeSubdomains: !args.keepSubdomains,
        secret: args.secret
      }, function (generatedPassword) {
        toClipboard.sync(generatedPassword)
        console.log('✓ password copied to clipboard\n')
        setTimeout(done, 1000)
      })
    })
  }

  async.forever(processor)
})

function geturl (rl, cb) {
  rl.question('Enter a URL: ', cb)
}
