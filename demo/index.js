/**
 * This example takes graph from wikipedia:
 * https://en.wikipedia.org/wiki/PageRank#mediaviewer/File:PageRanks-Example.svg
 * and computes page rank for it. Afterwards it renders it on the page with
 * force based layout
 */
var dot = require('ngraph.fromdot');
var render = require('ngraph.svg');
var arrow = require('s.arrow');
var pagerank = require('../');
var svg = render.svg;

// let's just use the same graph from wiki:
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

var rank = pagerank(graph);

var renderer = render(graph, {
  physics: {
    springLength: 180
  }
});

var layout = renderer.layout;
layout.pinNode(graph.getNode('b'), true);
renderer.node(createNode).placeNode(placeNode);
renderer.link(createLink).placeLink(placeLink);

renderer.run();

function createNode(node) {
  var g = svg('g');
  var r = getPageRankRadius(node.id);
  var rankString = (rank[node.id] * 100).toFixed(2) + '%';
  var label = svg('text', {
    y: -r - 5
  }).text(node.id + ' ' + rankString);
  var ui = svg('circle', {
    r: r,
    fill: 'deepskyblue'
  });
  g.append(ui);
  g.append(label);
  return g;
}

function placeNode(ui, pos) {
  ui.attr('transform', 'translate(' + pos.x + ',' + pos.y + ')');
}

function createLink() {
  var ui = arrow(renderer.svgRoot);
  ui.stroke('#5A5D6E');
  return ui;
}
function placeLink(ui, from, to, link) {
  var fromRadius = getPageRankRadius(link.toId);
  var toRadius = getPageRankRadius(link.fromId);
  ui.render(
    arrow.intersectCircle(from, to, fromRadius), // from
    arrow.intersectCircle(to, from, toRadius) // to
  );
}

function getPageRankRadius(id) {
  return Math.max(rank[id] * 40, 5);
}
