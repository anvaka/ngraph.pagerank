var g = require('ngraph.generators').grid(100, 100);
var pagerank = require('../');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

suite.add('Epsilon 1e-7', function() {
  pagerank(g, 0.85, 1e-7);
}).add('Epsilon 1e-10', function() {
  pagerank(g, 0.85, 1e-10);
}).on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
