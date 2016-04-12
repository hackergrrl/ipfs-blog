#!/usr/bin/env node

var publish = require('./index')
var fs = require('fs')

var files = fs.readdirSync(process.cwd())
files = files.filter(function isMarkdown (name) {
  return name.endsWith('.markdown') || name.endsWith('.md')
})

if (!files.length) {
  console.error('no .md or .markdown files in this directory')
  process.exit(1)
}

publish(files)
