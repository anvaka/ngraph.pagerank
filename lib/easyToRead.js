/**
 * This implementation is slower than the main implementation but it is
 * easier to follow. I'm keeping it here for your reference only, even though
 * it is not used.
 */

module.exports = pagerank;

function pagerank(graph, internalJumpProbability, epsilon) {
  if (typeof epsilon !== 'number') epsilon = 0.005;
  if (typeof internalJumpProbability !== 'number') internalJumpProbability = 0.85;

  var done = false; // when done is true, the algorithm is converged
  var distance = 0; // distance between two eigenvectors in adjacent timesteps
  var leakedRank = 0; // we account leaked rank to solve spider traps and dead ends

  var nodesCount = graph.getNodesCount();
  var nodes = initializeNodes(graph);
  var currentRank;
  var node;

  do {
    leakedRank = 0;
    for (var j = 0; j < nodesCount; ++j) {
      node = nodes[j];
      currentRank = 0;
      if (node.indegree === 0) {
        node.rank = 0;
      } else {
        var neighbors = node.neighbors;
        for (var i = 0; i < neighbors.length; ++i) {
          currentRank += neighbors[i].prevRank / neighbors[i].outdegree;
        }
        node.rank = internalJumpProbability * currentRank;
        leakedRank += node.rank;
      }
    }
    // now reinsert the leaked PageRank and compute distance:
    leakedRank = (1 - leakedRank) / nodesCount;
    distance = 0;
    for (j = 0; j < nodesCount; ++j) {
      node = nodes[j];
      currentRank = node.rank + leakedRank;
      distance += Math.abs(currentRank - node.prevRank);
      node.prevRank = currentRank; // set up for the next iteration
    }
    done = distance < epsilon;
  } while (!done);

  return finalResults(nodes);
}

function finalResults(pageRankNodes) {
  var result = Object.create(null);

  for (var i = 0; i < pageRankNodes.length; ++i) {
    var node = pageRankNodes[i];
    result[node.id] = node.prevRank;
  }

  return result;
}

function initializeNodes(graph) {
  var i = 0;
  var nodesCount = graph.getNodesCount();
  var initialRank = (1 / nodesCount);
  var nodes = new Array(nodesCount);
  // we want to use integers for faster iteration during computation. This
  // means we have to map node identifiers to their integers values
  var idToNumber = Object.create(null);

  // unfortunately we have to do two-pass to initialize both nodes and edges
  graph.forEachNode(addNode);
  graph.forEachNode(initLinks);

  return nodes;

  function addNode(node) {
    nodes[i] = new PageRankNode(initialRank, node.id);
    idToNumber[node.id] = i;
    i += 1;
  }

  function initLinks(node) {
    var pageRankNode = nodes[idToNumber[node.id]];
    var inDegree = 0;
    var outDegree = 0;
    var neighbors = pageRankNode.neighbors;

    graph.forEachLinkedNode(node.id, initLink);

    pageRankNode.indegree = inDegree;
    pageRankNode.outdegree = outDegree;

    function initLink(otherNode, link) {
      if (link.fromId === node.id) {
        outDegree += 1;
      }
      if (link.toId === node.id) {
        inDegree += 1;
        // TODO: this needs to be configurable. E.g. use outdegree
        neighbors.push(nodes[idToNumber[otherNode.id]]);
      }
    }
  }
}

function PageRankNode(initialRank, id) {
  this.id = id;
  this.rank = initialRank;
  this.prevRank = initialRank;
  this.outdegree = 0;
  this.indegree = 0;
  this.neighbors = [];
}
