/**
 * This is C++ implementation of the page rank. It was used as an input source
 * for emscripten compiler.
 */
#include<stdio.h>

double abs(double x) {
    return x < 0 ? -x : x;
}

void computePageRank(double *heap) {
    bool done = false; // when done is true, the algorithm is converged
    double distance = 0; // distance between two eigenvectors in adjacent timesteps
    double leakedRank = 0; // we account leaked rank to solve spider traps and dead ends
    //nodesCount, internalJumpProbability, epsilon
    double currentRank;
    int elementsPerNode = 5;
    int idx;
    int nodesCount = heap[0]/elementsPerNode;
    double internalJumpProbability = heap[2];
    double epsilon = heap[3];

    double* nodes = heap + 4;
    int edgesOffset = heap[0];
    double* edges = nodes + edgesOffset;

    do {
        leakedRank = 0;
        for (int j = 0; j < nodesCount; ++j) {
            idx = j * elementsPerNode;
            currentRank = 0;
            int neighborsLength = nodes[idx + 3];
            if (neighborsLength == 0) { // indegree === 0
                nodes[idx] = 0; // node.rank
            } else {
                int neighborsStart = nodes[idx + 4];
                for (int i = neighborsStart; i < neighborsStart + neighborsLength; ++i) {
                    int nIdx = edges[i];
                    currentRank += nodes[nIdx + 1] / nodes[nIdx + 2];
                    //currentRank += neighbors[i].prevRank / neighbors[i].outdegree;
                }
                nodes[idx] = internalJumpProbability * currentRank;
                leakedRank += nodes[idx];
            }
        }
        // now reinsert the leaked PageRank and compute distance:
        leakedRank = (1.0 - leakedRank) / (double)nodesCount;
        distance = 0;
        for (int j = 0; j < nodesCount; ++j) {
            idx = j * elementsPerNode;
            currentRank = nodes[idx] + leakedRank;
            distance += abs(currentRank - nodes[idx + 1]); // prevRank
            nodes[idx + 1] = currentRank; // set up for the next iteration prevRank
        }
        done = distance < epsilon;
    } while (!done);
}


int main() {
    // I used this for debugging only:
    double bytes[] = {55,17,0.85,0.0001,0.09090909090909091,0.09090909090909091,2,1,0,0.09090909090909091,0.09090909090909091,0,1,1,0.09090909090909091,0.09090909090909091,1,7,2,0.09090909090909091,0.09090909090909091,3,6,9,0.09090909090909091,0.09090909090909091,2,1,15,0.09090909090909091,0.09090909090909091,1,1,16,0.09090909090909091,0.09090909090909091,2,0,-1,0.09090909090909091,0.09090909090909091,2,0,-1,0.09090909090909091,0.09090909090909091,2,0,-1,0.09090909090909091,0.09090909090909091,1,0,-1,0.09090909090909091,0.09090909090909091,1,0,-1,15,0,0,15,25,20,30,35,40,20,30,35,40,45,50,15,10};

    computePageRank(bytes);
    for (int i = 0; i < 76; i++) {
        printf("%G,", bytes[i]);
    }
  return 0;
}
