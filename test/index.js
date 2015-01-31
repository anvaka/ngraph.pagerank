var dot = require('ngraph.fromdot');
var pagerank = require('../');
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
    '}'].join('\n'));

  var internalJumpProbability = 0.85;
  var rank = pagerank(graph, internalJumpProbability);

  // now just verify that probabilities match precomupted probabilities of the wiki:
  verify('a', 0.033);
  verify('b', 0.385);
  verify('c', 0.343);
  verify('d', 0.039);
  verify('e', 0.081);
  verify('f', 0.033);
  verify('g', 0.016);
  verify('h', 0.016);
  verify('i', 0.016);

  t.end();

  function verify(node, expected) {
    t.equals(rank[node], expected, 'Node ' + node + ' has expected rank ' + expected);
  }
});
