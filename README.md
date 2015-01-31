# ngraph.pagerank [![Build Status](https://travis-ci.org/anvaka/ngraph.pagerank.svg)](https://travis-ci.org/anvaka/ngraph.pagerank)

PageRank algorithm implementation in JavaScript. This module is part of
[ngraph](https://github.com/anvaka/ngraph) family.

# usage

Let's compute PageRank for a simple graph with two nodes, one edge:

``` javascript
var graph = require('ngraph.graph')();
graph.addLink(1, 2);

var pagerank = require('ngraph.pagerank');
var rank = pagerank(graph);
```

This code will compute PageRank for two nodes:

``` json
{
  "1": 0.350877,
  "2": 0.649123
}
```

## configuring

The PageRank algorithm allows you to specify a probability at any step that a
person will continue clicking outgoing links. This probability in some literature
is called a dumping factor, and is recommended to be set between 0.80 and 0.90.

To configure this probability use the second, optional argument of the `pagerank()`
function:

``` javascript
// by default this value is 0.85. Bump it to 0.9:
var internalJumpProbability = 0.90;
var rank = pagerank(graph, internalJumpProbability);
```

Current implementation uses approximate solution for eigenvector problem. To
specify precision level use the last optional argument:

``` javascript
var internalJumpProbability = 0.85;
// by default it's set to 0.005, let's increase it:
var precision = 0.00001;
var rank = pagerank(graph, internalJumpProbability, precision);
```

`precision` will affect algorithm performance and serves as an exit criteria:

```
|r(t) - r(t - 1)| < precision
```

Here `r(t)` is eigenvector (or pagerank of a graph) at time step `t`.

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.pagerank
```

# license

MIT
