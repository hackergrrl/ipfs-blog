# ipfs-blog

> opinionated ipfs-powered blog

## Background

Wouldn't it be nice to have a simple static HTML blog that you didn't need to
worry about hosting?

## Prerequisites

You'll need [IPFS](https://ipfs.io) installed, at least
[0.4.0](http://dist.ipfs.io/#go-ipfs).

## Usage

```sh
$ npm install -g ipfs-blog

$ cd /tmp

$ cat > article.md
# Hello world!

This is my very first blog entry to the permanent web! Huzzah!
^D

$ ipfs-blog
wrote article.md
https://ipfs.io/ipfs/QmR8kn6CQzBADU6BvHPnvnkpXKykkJVwjJVujPqZz3nWDj
```

![](https://raw.githubusercontent.com/noffle/ipfs-blog/master/static/screenshot.png)

Note that you'll need a local [IPFS daemon](https://dist.ipfs.io/#go-ipfs)
running in order to publish.

## Customization

All flavour text is hard-coded for now. PRs that better facilitate user
customization (blog name, dominant color, etc) are very welcome!

## License

ISC
