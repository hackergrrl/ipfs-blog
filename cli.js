#!/usr/bin/env node

var publish = require('./index')
var fs = require('fs')

var args = require('minimist')(process.argv)

var files = fs.readdirSync(process.cwd())
files = files.filter(function isMarkdown (name) {
  return name.endsWith('.markdown') || name.endsWith('.md')
})

if (!files.length) {
  console.error('no .md or .markdown files in this directory')
  process.exit(1)
}

var opts = {
  title: args.t || args.title || 'The Permanent Blog'
}

publish(files, opts)
