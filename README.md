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

**TODO: screenshot**

## License

ISC
