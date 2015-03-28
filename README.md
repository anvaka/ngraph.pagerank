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

# performance

The focus of this module is to be very fast. I tried multiple approaches, including

* [Easy to read code](lib/easyToRead.js) with plain old javascript objects
* [Approach with typed arrays](index.js), where objects are stored into flat array
* [C++ version](lib/native.cpp) of the code, compiled into asm.js and extracted into
[separate module](lib/native.asm.js)

So far approach with typed array gives the fastest results in v8/node.js 0.12:
`43 ops/sec`. asm.js version is the fastest when executed inside
spider monkey (firefox) with `50 ops/sec`. Unfortunately asm.js version
gives terrible results in `iojs 1.5` (around 20 ops/sec), and while performs at
`47 ops/sec` in `node.js 0.12` the deviation is too big (around 7%) to call it
stable. I'm frankly a little bit lost and not sure why asm.js gives such poor
results in v8. So currently sticking with approach with typed arrays.

# demo

A small demo is available [here](https://anvaka.github.io/ngraph.pagerank/demo/).
It computes PageRank for [a graph from Wikipedia](https://en.wikipedia.org/wiki/PageRank#mediaviewer/File:PageRanks-Example.svg)
and then renders it with force based layout.

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.pagerank
```

# license

MIT

# TODO:

Implement topic-specific rank?
