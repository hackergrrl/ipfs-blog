/*
M1:
- grab all *.(md|markdown) files
- compile them all to HTML
- generate an index.html that links to all articles
- add all to IPFS and output public gateway link

M2:
- inject css into each html page for styling
- show titles on index.html
*/
var fs = require('fs')
var marked = require('marked')
var trumpet = require('trumpet')
var bl = require('bl')
var comandante = require('comandante')
var tmp = require('tmp')
var path = require('path')

module.exports = function () {
  var files = fs.readdirSync(process.cwd())

  // filter non-markdown
  files = files.filter(function isMarkdown (name) {
    return name.endsWith('.markdown') || name.endsWith('.md')
  })

  // create a temp dir
  var tmpdir = tmp.dirSync({
    unsafeCleanup: true
  })

  comandante('cp', [__dirname + '/index.css', tmpdir.name])

  // fire up trumpet
  var tr = trumpet()

  // prepare to write index.html
  var index = path.join(tmpdir.name, 'index.html')
  tr.pipe(fs.createWriteStream(index))

  // prepare to fill in articles
  var ws = tr.select('#blog-articles').createWriteStream()

  files.sort(function compare(a, b) {
    return fs.statSync(b).ctime - fs.statSync(a).ctime
  })

  // process all articles
  files.forEach(function (file) {
    var articleMd = fs.readFileSync(file).toString()

    // extract title
    var title = articleMd.substring(0, articleMd.indexOf('\n'))
      .replace(/#+ /, '')

    // compile to HTML
    var html = marked(articleMd)
    var fileHtml = file
      .replace('.md', '.html')
      .replace('.markdown', '.html')

    // write entry to index.html
    var stat = fs.statSync(file)
    ws.write('\n<li class="article-item">' + stat.ctime + ' - <a href="' + fileHtml + '">' + title + '</a></li>\n')

    // write HTML
    var buf = new bl()
    buf.append(new Buffer(html))
    var fname = path.join(tmpdir.name, fileHtml)
    buf.pipe(fs.createWriteStream(fname))
  })

  ws.end()

  var rootHash = ''
  fs.createReadStream(__dirname + '/index.html').pipe(tr)
    .on('end', function () {
      comandante('ipfs', ('add -rq ' + tmpdir.name).split(' '))
        .on('data', function (hash) {
          rootHash = hash.toString().trim()
        })
        .on('end', function () {
          // console.log('https://ipfs.io/ipfs/' + rootHash)
          console.log('http://localhost:9090/ipfs/' + rootHash)
          tmpdir.removeCallback()
        })
    })
}()

function ipfsAddStream () {
  return comandante('ipfs', ['add', '-q'])
}
