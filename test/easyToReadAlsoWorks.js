var dot = require('ngraph.fromdot');
var pagerank = require('../lib/easyToRead.js');
var test = require('tap').test;

test('it calculates page rank', function(t) {
  // using graph from wikipedia:
  // https://en.wikipedia.org/wiki/PageRank#mediaviewer/File:PageRanks-Example.svg
  var graph = dot([
    'digraph G {',
    'd -> { a b }',
    'e -> { d b f }',
    'b -> c',
    'c -> b',
    'f -> {e b}',
    '{g h i} -> {b e}',
    '{j k} -> e',
    '}'
  ].join('\n'));

  var internalJumpProbability = 0.85;
  var rank = pagerank(graph, internalJumpProbability, 0.0001);

  // now just verify that probabilities match precomupted probabilities of the wiki:
  verify(rank.a, 0.033, t);
  verify(rank.b, 0.384, t);
  verify(rank.c, 0.343, t);
  verify(rank.d, 0.039, t);
  verify(rank.e, 0.081, t);
  verify(rank.f, 0.039, t);
  verify(rank.g, 0.016, t);
  verify(rank.h, 0.016, t);
  verify(rank.i, 0.016, t);

  t.end();

});

test('it works with loops', function(t) {
  var graph = dot([
    'digraph G {',
    'a -> {y m}',
    'y -> {y a}',
    'm -> m',
    '}'
  ].join('\n'));
  var rank = pagerank(graph, 0.8, 0.0000001);
  verify(rank.a, 0.152, t);
  verify(rank.y, 0.212, t);
  verify(rank.m, 0.636, t);
  t.end();
});

function verify(nodeRank, expected, t) {
  t.equals(nodeRank.toFixed(3), expected.toString(), 'Node has expected rank ' + expected);
}
