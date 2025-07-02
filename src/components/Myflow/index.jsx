import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import CustomNode from './cutomNode';
import GraphControls from '../Toolbar';
import { validateDag, getLayoutedElements } from './utils'
import 'reactflow/dist/style.css';
import './index.css'; // Custom CSS for modal

let id = 3;
const getId = () => `${id++}`;

const initialNodes = [
  { id: '1', position: { x: 100, y: 50 }, data: { label: 'Node 1' }, type: 'custom' },
  { id: '2', position: { x: 300, y: 150 }, data: { label: 'Node 2' }, type: 'custom' },
];

const nodeTypes = {
  custom: CustomNode,
};

const initialEdges = [{
  id: 'e1-2', source: '1', target: '2', markerEnd: {
    type: 'arrowclosed',
    color: '#000000',
    width: 30,
    height: 30,
  }
}];

const MyFlow = () => {
  const [nodes, setNodes, _onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, _onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)
  const [nodeLabel, setNodeLabel] = useState('');
  const [dagValidation, setDagValidation] = useState({ isValid: true, errors: [] })
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {

    const result = validateDag(nodes, edges);
    setDagValidation(result);
  }, [nodes, edges])

  const pushToUndoStack = useCallback(() => {
    setUndoStack((stack) => [
      ...stack,
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      },
    ]);
    setRedoStack([]);
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) {
        alert('Self-connections are not allowed.');
        return;
      }
      pushToUndoStack();
      const edge = {
        ...params,
        markerEnd: {
          type: 'arrowclosed',
          color: '#000000',
          width: 30,
          height: 30,
        },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges, pushToUndoStack]
  );

  

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, [])

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;

    setUndoStack((stack) => [...stack, { nodes, edges }]);
    setRedoStack([]); // Clear redo history

    // Remove the selected node
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));

    // Remove edges connected to the node
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId)
    );

    setSelectedNodeId(null);
  };

  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation(); // prevent unselecting by clicking the pane
    setSelectedEdgeId(edge.id);
  }, [])

  const deleteSelectedEdge = () => {
    if (!selectedEdgeId) return;

    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  };

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedEdgeId(null);
  }, [])

  const addNode = () => {
    setUndoStack((stack) => [...stack, { nodes, edges }]);
    setRedoStack([]); // Clear redo history
    const newNode = {
      id: getId(),
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: nodeLabel },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeLabel('');
    setIsModalOpen(false);
  };

  const formatGraph = () => {
    const { nodes: layouted, edges: updatedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layouted]);
    setEdges([...updatedEdges]);
  };

  const onNodesChange = useCallback(
    (changes) => {
      const hasStructuralChange = changes.some(change =>
        ['add', 'remove'].includes(change.type)
      );
      if (hasStructuralChange) pushToUndoStack();
      _onNodesChange(changes);
    },
    [pushToUndoStack, _onNodesChange]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const hasStructuralChange = changes.some(change =>
        ['add', 'remove'].includes(change.type)
      );
      if (hasStructuralChange) pushToUndoStack();
      _onEdgesChange(changes);
    },
    [pushToUndoStack, _onEdgesChange]
  );


  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const prev = undoStack[undoStack.length - 1];
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack, { nodes, edges }]);
    setNodes(prev.nodes);
    setEdges(prev.edges);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
  };


  return (
    <div className='page-container'>
      <GraphControls
        setIsModalOpen={setIsModalOpen}
        deleteSelectedNode={deleteSelectedNode}
        deleteSelectedEdge={deleteSelectedEdge}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        formatGraph={formatGraph}
        selectedNodeId={selectedNodeId}
        selectedEdgeId={selectedEdgeId}
        undoStack={undoStack}
        redoStack={redoStack}
        dagValidation={dagValidation}
      />


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Node</h3>
            <input
              type="text"
              placeholder="Enter node label"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={addNode} disabled={!nodeLabel.trim()}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='graph-container'>
        <div className='graph-board' >
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              className: node.id === selectedNodeId ? 'selected' : '',
            }))}
            edges={edges.map((edge) => ({
              ...edge,
              style:
                edge.id === selectedEdgeId
                  ? { stroke: 'red', strokeWidth: 1 } // highlight selected edge
                  : {},
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
          />
        </div>
      </div>
    </div>
  )
}

export default function WrappedFlow() {
  return (
    <ReactFlowProvider>
      <MyFlow />
    </ReactFlowProvider>
  );
}
