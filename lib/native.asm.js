/**
 * Computes PageRank for a graph, using asm.js. The actual function was
 * taken from emscripten compilation of the native.cpp
 */
module.exports = asmpagerank;

var elementsPerNode = 5;

function asmpagerank(graph, internalJumpProbability, epsilon) {
  if (typeof epsilon !== 'number') epsilon = 0.005;
  if (typeof internalJumpProbability !== 'number') internalJumpProbability = 0.85;

  // since we may be executed in the strict mode make sure we get real global
  // context regardless of the platform (e.g. node, spidermonkey shell, d8)
  var stdlib = (function() {
    return this || (0 || eval)('this');
  }());
  var asmGraph = initializeAsmGraph(graph, internalJumpProbability, epsilon);
  var asmCode = computePageRank(stdlib, null, asmGraph.heap);
  asmCode.compute();

  return finalResultsFromAsm(asmGraph.heap, asmGraph.numberToId);
}

// we store graph as two arrays:
//  * nodes - One node of a graph occupies 5 positions in the array:
//    [pageRank, previous page rank, out degree, in degree, pointer to `edges`]
//  * edges - This arry holds pointers to neighbors who contributed to a node's
//  rank. Each element is a pointer to `node` record in the `nodes` array.
function computePageRank(global, foreign, buffer) {
  "use asm";
  var STACKTOP = 0;
  var HEAPF64 = new global.Float64Array(buffer);
  var Math_imul=global.Math.imul;
  var Math_abs=global.Math.abs;

function compute() {
 var $heap = 0;
 var $0 = 0, $1 = 0, $10 = 0, $100 = 0.0, $101 = 0.0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0.0, $107 = 0.0, $108 = 0.0, $109 = 0.0, $11 = 0, $110 = 0.0, $111 = 0.0, $112 = 0, $113 = 0, $114 = 0, $115 = 0;
 var $116 = 0, $117 = 0, $118 = 0.0, $119 = 0.0, $12 = 0.0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0.0, $17 = 0, $18 = 0, $19 = 0, $2 = 0.0, $20 = 0, $21 = 0;
 var $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0.0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0.0;
 var $40 = 0, $41 = 0, $42 = 0.0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0.0, $50 = 0, $51 = 0, $52 = 0, $53 = 0.0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0;
 var $59 = 0.0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0.0, $65 = 0.0, $66 = 0.0, $67 = 0.0, $68 = 0, $69 = 0, $7 = 0, $70 = 0.0, $71 = 0.0, $72 = 0.0, $73 = 0, $74 = 0, $75 = 0, $76 = 0;
 var $77 = 0, $78 = 0, $79 = 0.0, $8 = 0, $80 = 0.0, $81 = 0.0, $82 = 0, $83 = 0, $84 = 0.0, $85 = 0.0, $86 = 0, $87 = 0.0, $88 = 0.0, $89 = 0, $9 = 0.0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0;
 var $95 = 0, $96 = 0, $97 = 0, $98 = 0.0, $99 = 0.0, $currentRank = 0.0, $distance = 0.0, $done = 0, $edges = 0, $edgesOffset = 0, $elementsPerNode = 0, $epsilon = 0.0, $i = 0, $idx = 0, $internalJumpProbability = 0.0, $j = 0, $j1 = 0, $leakedRank = 0.0, $nIdx = 0, $neighborsLength = 0;
 var $neighborsStart = 0, $nodes = 0, $nodesCount = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = $heap;
 $done = 0; //@line 12 "./native.cpp"
 $distance = 0.0; //@line 13 "./native.cpp"
 $leakedRank = 0.0; //@line 14 "./native.cpp"
 $elementsPerNode = 5; //@line 17 "./native.cpp"
 $1 = $0; //@line 19 "./native.cpp"
 $2 = +HEAPF64[$1>>3]; //@line 19 "./native.cpp"
 $3 = $elementsPerNode; //@line 19 "./native.cpp"
 $4 = (+($3|0)); //@line 19 "./native.cpp"
 $5 = $2 / $4; //@line 19 "./native.cpp"
 $6 = (~~(($5))); //@line 19 "./native.cpp"
 $nodesCount = $6; //@line 19 "./native.cpp"
 $7 = $0; //@line 20 "./native.cpp"
 $8 = (($7) + 16|0); //@line 20 "./native.cpp"
 $9 = +HEAPF64[$8>>3]; //@line 20 "./native.cpp"
 $internalJumpProbability = $9; //@line 20 "./native.cpp"
 $10 = $0; //@line 21 "./native.cpp"
 $11 = (($10) + 24|0); //@line 21 "./native.cpp"
 $12 = +HEAPF64[$11>>3]; //@line 21 "./native.cpp"
 $epsilon = $12; //@line 21 "./native.cpp"
 $13 = $0; //@line 23 "./native.cpp"
 $14 = (($13) + 32|0); //@line 23 "./native.cpp"
 $nodes = $14; //@line 23 "./native.cpp"
 $15 = $0; //@line 24 "./native.cpp"
 $16 = +HEAPF64[$15>>3]; //@line 24 "./native.cpp"
 $17 = (~~(($16))); //@line 24 "./native.cpp"
 $edgesOffset = $17; //@line 24 "./native.cpp"
 $18 = $nodes; //@line 25 "./native.cpp"
 $19 = $edgesOffset; //@line 25 "./native.cpp"
 $20 = (($18) + ($19<<3)|0); //@line 25 "./native.cpp"
 $edges = $20; //@line 25 "./native.cpp"
 while(1) {
  $leakedRank = 0.0; //@line 28 "./native.cpp"
  $j = 0; //@line 29 "./native.cpp"
  while(1) {
   $21 = $j; //@line 29 "./native.cpp"
   $22 = $nodesCount; //@line 29 "./native.cpp"
   $23 = ($21|0)<($22|0); //@line 29 "./native.cpp"
   if (!($23)) {
    break;
   }
   $24 = $j; //@line 30 "./native.cpp"
   $25 = $elementsPerNode; //@line 30 "./native.cpp"
   $26 = Math_imul($24, $25)|0; //@line 30 "./native.cpp"
   $idx = $26; //@line 30 "./native.cpp"
   $currentRank = 0.0; //@line 31 "./native.cpp"
   $27 = $idx; //@line 32 "./native.cpp"
   $28 = (($27) + 3)|0; //@line 32 "./native.cpp"
   $29 = $nodes; //@line 32 "./native.cpp"
   $30 = (($29) + ($28<<3)|0); //@line 32 "./native.cpp"
   $31 = +HEAPF64[$30>>3]; //@line 32 "./native.cpp"
   $32 = (~~(($31))); //@line 32 "./native.cpp"
   $neighborsLength = $32; //@line 32 "./native.cpp"
   $33 = $neighborsLength; //@line 33 "./native.cpp"
   $34 = ($33|0)==(0); //@line 33 "./native.cpp"
   if ($34) {
    $35 = $idx; //@line 34 "./native.cpp"
    $36 = $nodes; //@line 34 "./native.cpp"
    $37 = (($36) + ($35<<3)|0); //@line 34 "./native.cpp"
    HEAPF64[$37>>3] = 0.0; //@line 34 "./native.cpp"
   } else {
    $38 = $idx; //@line 36 "./native.cpp"
    $39 = (($38) + 4)|0; //@line 36 "./native.cpp"
    $40 = $nodes; //@line 36 "./native.cpp"
    $41 = (($40) + ($39<<3)|0); //@line 36 "./native.cpp"
    $42 = +HEAPF64[$41>>3]; //@line 36 "./native.cpp"
    $43 = (~~(($42))); //@line 36 "./native.cpp"
    $neighborsStart = $43; //@line 36 "./native.cpp"
    $44 = $neighborsStart; //@line 37 "./native.cpp"
    $i = $44; //@line 37 "./native.cpp"
    while(1) {
     $45 = $i; //@line 37 "./native.cpp"
     $46 = $neighborsStart; //@line 37 "./native.cpp"
     $47 = $neighborsLength; //@line 37 "./native.cpp"
     $48 = (($46) + ($47))|0; //@line 37 "./native.cpp"
     $49 = ($45|0)<($48|0); //@line 37 "./native.cpp"
     if (!($49)) {
      break;
     }
     $50 = $i; //@line 38 "./native.cpp"
     $51 = $edges; //@line 38 "./native.cpp"
     $52 = (($51) + ($50<<3)|0); //@line 38 "./native.cpp"
     $53 = +HEAPF64[$52>>3]; //@line 38 "./native.cpp"
     $54 = (~~(($53))); //@line 38 "./native.cpp"
     $nIdx = $54; //@line 38 "./native.cpp"
     $55 = $nIdx; //@line 39 "./native.cpp"
     $56 = (($55) + 1)|0; //@line 39 "./native.cpp"
     $57 = $nodes; //@line 39 "./native.cpp"
     $58 = (($57) + ($56<<3)|0); //@line 39 "./native.cpp"
     $59 = +HEAPF64[$58>>3]; //@line 39 "./native.cpp"
     $60 = $nIdx; //@line 39 "./native.cpp"
     $61 = (($60) + 2)|0; //@line 39 "./native.cpp"
     $62 = $nodes; //@line 39 "./native.cpp"
     $63 = (($62) + ($61<<3)|0); //@line 39 "./native.cpp"
     $64 = +HEAPF64[$63>>3]; //@line 39 "./native.cpp"
     $65 = $59 / $64; //@line 39 "./native.cpp"
     $66 = $currentRank; //@line 39 "./native.cpp"
     $67 = $66 + $65; //@line 39 "./native.cpp"
     $currentRank = $67; //@line 39 "./native.cpp"
     $68 = $i; //@line 37 "./native.cpp"
     $69 = (($68) + 1)|0; //@line 37 "./native.cpp"
     $i = $69; //@line 37 "./native.cpp"
    }
    $70 = $internalJumpProbability; //@line 42 "./native.cpp"
    $71 = $currentRank; //@line 42 "./native.cpp"
    $72 = $70 * $71; //@line 42 "./native.cpp"
    $73 = $idx; //@line 42 "./native.cpp"
    $74 = $nodes; //@line 42 "./native.cpp"
    $75 = (($74) + ($73<<3)|0); //@line 42 "./native.cpp"
    HEAPF64[$75>>3] = $72; //@line 42 "./native.cpp"
    $76 = $idx; //@line 43 "./native.cpp"
    $77 = $nodes; //@line 43 "./native.cpp"
    $78 = (($77) + ($76<<3)|0); //@line 43 "./native.cpp"
    $79 = +HEAPF64[$78>>3]; //@line 43 "./native.cpp"
    $80 = $leakedRank; //@line 43 "./native.cpp"
    $81 = $80 + $79; //@line 43 "./native.cpp"
    $leakedRank = $81; //@line 43 "./native.cpp"
   }
   $82 = $j; //@line 29 "./native.cpp"
   $83 = (($82) + 1)|0; //@line 29 "./native.cpp"
   $j = $83; //@line 29 "./native.cpp"
  }
  $84 = $leakedRank; //@line 47 "./native.cpp"
  $85 = 1.0 - $84; //@line 47 "./native.cpp"
  $86 = $nodesCount; //@line 47 "./native.cpp"
  $87 = (+($86|0)); //@line 47 "./native.cpp"
  $88 = $85 / $87; //@line 47 "./native.cpp"
  $leakedRank = $88; //@line 47 "./native.cpp"
  $distance = 0.0; //@line 48 "./native.cpp"
  $j1 = 0; //@line 49 "./native.cpp"
  while(1) {
   $89 = $j1; //@line 49 "./native.cpp"
   $90 = $nodesCount; //@line 49 "./native.cpp"
   $91 = ($89|0)<($90|0); //@line 49 "./native.cpp"
   if (!($91)) {
    break;
   }
   $92 = $j1; //@line 50 "./native.cpp"
   $93 = $elementsPerNode; //@line 50 "./native.cpp"
   $94 = Math_imul($92, $93)|0; //@line 50 "./native.cpp"
   $idx = $94; //@line 50 "./native.cpp"
   $95 = $idx; //@line 51 "./native.cpp"
   $96 = $nodes; //@line 51 "./native.cpp"
   $97 = (($96) + ($95<<3)|0); //@line 51 "./native.cpp"
   $98 = +HEAPF64[$97>>3]; //@line 51 "./native.cpp"
   $99 = $leakedRank; //@line 51 "./native.cpp"
   $100 = $98 + $99; //@line 51 "./native.cpp"
   $currentRank = $100; //@line 51 "./native.cpp"
   $101 = $currentRank; //@line 52 "./native.cpp"
   $102 = $idx; //@line 52 "./native.cpp"
   $103 = (($102) + 1)|0; //@line 52 "./native.cpp"
   $104 = $nodes; //@line 52 "./native.cpp"
   $105 = (($104) + ($103<<3)|0); //@line 52 "./native.cpp"
   $106 = +HEAPF64[$105>>3]; //@line 52 "./native.cpp"
   $107 = $101 - $106; //@line 52 "./native.cpp"
   $108 = (+Math_abs($107)); //@line 52 "./native.cpp"
   $109 = $distance; //@line 52 "./native.cpp"
   $110 = $109 + $108; //@line 52 "./native.cpp"
   $distance = $110; //@line 52 "./native.cpp"
   $111 = $currentRank; //@line 53 "./native.cpp"
   $112 = $idx; //@line 53 "./native.cpp"
   $113 = (($112) + 1)|0; //@line 53 "./native.cpp"
   $114 = $nodes; //@line 53 "./native.cpp"
   $115 = (($114) + ($113<<3)|0); //@line 53 "./native.cpp"
   HEAPF64[$115>>3] = $111; //@line 53 "./native.cpp"
   $116 = $j1; //@line 49 "./native.cpp"
   $117 = (($116) + 1)|0; //@line 49 "./native.cpp"
   $j1 = $117; //@line 49 "./native.cpp"
  }
  $118 = $distance; //@line 55 "./native.cpp"
  $119 = $epsilon; //@line 55 "./native.cpp"
  $120 = $118 < $119; //@line 55 "./native.cpp"
  $121 = $120&1; //@line 55 "./native.cpp"
  $done = $121; //@line 55 "./native.cpp"
  $122 = $done; //@line 56 "./native.cpp"
  $123 = $122&1; //@line 56 "./native.cpp"
  $124 = $123 ^ 1; //@line 56 "./native.cpp"
  if (!($124)) {
   break;
  }
 }
 STACKTOP = sp;return; //@line 57 "./native.cpp"
}
return { compute: compute };
}

function finalResultsFromAsm(heap, idLookup) {
  var result = Object.create(null);
  var meta = new Float64Array(heap, 0, 4);
  var length = meta[0] / elementsPerNode;
  var nodes = new Float64Array(heap, 4 * 8, meta[0]);

  for (var i = 0; i < length; ++i) {
    var idx = i * elementsPerNode;
    result[idLookup[i]] = nodes[idx + 1]; //.prevRank;
  }

  return result;
}

function initializeAsmGraph(graph, internalJumpProbability, epsilon) {
  var i = 0;
  var lastEdge = 0;
  var nodesCount = graph.getNodesCount();
  var edgesCount = graph.getLinksCount();
  var initialRank = (1 / nodesCount);
  // set up heap, so that it can be used in asm.js code:
  var nodesLength = nodesCount * elementsPerNode;
  var totalLength =    (1 + /* length of nodes array */
      1 + /* length of edges array */
      1 + /* internal jump probability */
      1 + /* epsilon */
      nodesLength + edgesCount) * Float64Array.BYTES_PER_ELEMENT;

  // SpiderMonkey requires the heap size to be a power of 2. However
  // this gives negative results for v8 (not sure why).
  var rounded = nearestPowerOf2(totalLength);
  //var rounded = totalLength;

  var heap = new ArrayBuffer(rounded);

  var sizeInfo = new Float64Array(heap, 0, 4);
  sizeInfo[0] = nodesLength;
  sizeInfo[1] = edgesCount;
  sizeInfo[2] = internalJumpProbability;
  sizeInfo[3] = epsilon;

  var nodes = new Float64Array(heap, 4 * 8, nodesLength);
  var edges = new Float64Array(heap, (4 + nodesLength) * 8, edgesCount);
  var numberToId = new Array(nodesCount);
  // we want to use integers for faster iteration during computation. This
  // means we have to map node identifiers to their integers values
  var idToNumber = Object.create(null);

  // unfortunately we have to do two-pass to initialize both nodes and edges
  graph.forEachNode(addNode);
  graph.forEachNode(initLinks);

  return {
    heap: heap,
    numberToId: numberToId
  };

  function addNode(node) {
    var idx = i * elementsPerNode;
    // initial rank
    nodes[idx] = initialRank;
    // prevRank
    nodes[idx + 1] = initialRank;
    // outDegree
    nodes[idx + 2] = 0;
    // inDegree
    nodes[idx + 3] = 0;
    // neighbors array, it's length is the same as inDegree
    nodes[idx + 4] = -1;

    idToNumber[node.id] = i;
    numberToId[i] = node.id;
    i += 1;
  }

  function initLinks(node) {
    var idx = idToNumber[node.id] * elementsPerNode;
    var inDegree = 0;
    var outDegree = 0;
    var edgeStart = lastEdge;

    graph.forEachLinkedNode(node.id, initLink);

    nodes[idx + 2] = outDegree;
    nodes[idx + 3] = inDegree;
    if (edgeStart !== lastEdge) {
      nodes[idx + 4] = edgeStart;
    }

    function initLink(otherNode, link) {
      if (link.fromId === node.id) {
        outDegree += 1;
      }
      if (link.toId === node.id) {
        inDegree += 1;
        // TODO: this needs to be configurable. E.g. use outdegree
        edges[lastEdge++] = idToNumber[otherNode.id] * elementsPerNode;
      }
    }
  }
}

function nearestPowerOf2(x) {
  return Math.pow(2, Math.ceil(Math.log(x)/Math.log(2)));
}
