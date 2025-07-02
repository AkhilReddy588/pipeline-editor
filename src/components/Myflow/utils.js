import dagre from 'dagre'

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x,
        y,
      },
      // To prevent React Flow from repositioning it
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      targetPosition: isHorizontal ? 'left' : 'top',
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const validateDag = (nodes, edges) => {
  const errors = [];

  // Check 1: Minimum nodes
  if (nodes.length < 2) {
    errors.push('Graph must have at least 2 nodes.');
  }

  // Check 2: All nodes must be connected to at least one edge
  const connectedNodeIds = new Set();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  nodes.forEach((node) => {
    if (!connectedNodeIds.has(node.id)) {
      errors.push(`Node "${node.data.label || node.id}" is not connected.`);
    }
  });

  // Check 3: Cycle detection
  const adjList = {};
  nodes.forEach((node) => (adjList[node.id] = []));
  edges.forEach((edge) => {
    adjList[edge.source].push(edge.target);
  });

  const visited = {};
  const recStack = {};

  const hasCycle = (nodeId) => {
    if (!visited[nodeId]) {
      visited[nodeId] = true;
      recStack[nodeId] = true;

      for (let neighbor of adjList[nodeId]) {
        if (!visited[neighbor] && hasCycle(neighbor)) return true;
        else if (recStack[neighbor]) return true;
      }
    }
    recStack[nodeId] = false;
    return false;
  };

  for (let node of nodes) {
    if (hasCycle(node.id)) {
      errors.push('Graph contains a cycle.');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
