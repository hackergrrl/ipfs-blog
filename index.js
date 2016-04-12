/*
M1:
x grab all *.(md|markdown) files
x compile them all to HTML
x generate an index.html that links to all articles
x add all to IPFS and output public gateway link

M2:
x inject css into index
x show titles on index.html
x inject css into each article
x date on each article

M3:
- show blog title on all pages in dynamic fashion
*/

var fs = require('fs')
var marked = require('marked')
var trumpet = require('trumpet')
var bl = require('bl')
var comandante = require('comandante')
var tmp = require('tmp')
var path = require('path')

module.exports = function (files) {
  // create a temp dir
  var tmpdir = tmp.dirSync({
    unsafeCleanup: true
  })

  // Copy over CSS
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

  var articlesToWrite = files.length + 1

  // process all articles
  files.forEach(function (file) {
    var articleMd = fs.readFileSync(file).toString()

    // extract title
    var title = articleMd.substring(0, articleMd.indexOf('\n'))
      .replace(/#+ /, '')
    articleMd = articleMd.substring(articleMd.indexOf('\n')+1)

    // compile to HTML
    var html = marked(articleMd)
    var fileHtml = file
      .replace('.md', '.html')
      .replace('.markdown', '.html')

    // write entry to index.html
    var stat = fs.statSync(file)
    ws.write('\n<li class="article-item">' + stat.ctime + ' - <a href="' + fileHtml + '">' + title + '</a></li>\n')

    // prepare to write article into article.html template
    var atr = trumpet()
    var fname = path.join(tmpdir.name, fileHtml)
    atr.pipe(fs.createWriteStream(fname))

    // write HTML to article body
    var buf = new bl()
    buf.append(new Buffer(html))
    buf.pipe(atr.select('#body').createWriteStream())

    var tws = atr.select('.title').createWriteStream()
    tws.end(title)

    var dws = atr.select('#date').createWriteStream()
    dws.end(stat.ctime.toString())

    // use template
    fs.createReadStream(__dirname + '/article.html').pipe(atr)

    atr.on('end', function() {
      articlesToWrite--
      console.error('wrote', title)
      if (articlesToWrite <= 0) {
        publish()
      }
    })
  })

  ws.end()

  var rootHash = ''
  fs.createReadStream(__dirname + '/index.html').pipe(tr)
    .on('end', function () {
      articlesToWrite--
      if (articlesToWrite <= 0) {
        publish()
      }
    })

  // publish to IPFS using local daemon
  function publish () {
    comandante('ipfs', ('add -rq ' + tmpdir.name).split(' '))
      .on('data', function (hash) {
        rootHash = hash.toString().trim()
      })
      .on('end', function () {
        console.log('https://ipfs.io/ipfs/' + rootHash)
        // console.log('http://localhost:9090/ipfs/' + rootHash)
        tmpdir.removeCallback()
      })
  }
}
