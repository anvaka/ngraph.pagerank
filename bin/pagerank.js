#!/usr/bin/env node

var pagerank = require('../index.js')
var fromdot = require('ngraph.fromdot');

var fs = require('fs');
var filePath = process.argv[2]
if (!filePath) {
  console.log('Pagrank computation for a dot file');
  console.log('');
  console.log('Usage: ');
  console.log(' pagerank graph.dot');
  process.exit(-1)
}

var content = fs.readFileSync(filePath, 'utf8');
var graph = fromdot(content);
var rank = pagerank(graph);
Object.keys(rank).sort(byRank).forEach(print);

function byRank(x, y) {
  return rank[y] - rank[x];
}

function print(key) {
  console.log(key + ' - ' + rank[key]);
}
