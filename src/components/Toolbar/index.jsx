import {
  MdAddCircleOutline,
  MdDeleteOutline,
  MdRemoveCircleOutline,
  MdAutoFixHigh,
  MdVerified,
  MdWarningAmber,
} from 'react-icons/md';
import { AiOutlineUndo, AiOutlineRedo } from 'react-icons/ai';
import './index.css';

const GraphControls = ({
  setIsModalOpen,
  deleteSelectedNode,
  deleteSelectedEdge,
  handleUndo,
  handleRedo,
  formatGraph,
  selectedNodeId,
  selectedEdgeId,
  undoStack,
  redoStack,
  dagValidation,
}) => {
  return (
    <div className='toolbar'>
      <div className='toolbar-section'>
        <button onClick={() => setIsModalOpen(true)} className='toolbar-btn'>
          <MdAddCircleOutline size={20} />
          <span>Add Node</span>
        </button>

        <button
          onClick={deleteSelectedNode}
          className='toolbar-btn'
          disabled={!selectedNodeId}
        >
          <MdDeleteOutline size={20} />
          <span>Delete Node</span>
        </button>

        <button
          onClick={deleteSelectedEdge}
          className='toolbar-btn'
          disabled={!selectedEdgeId}
        >
          <MdRemoveCircleOutline size={20} />
          <span>Delete Edge</span>
        </button>
      </div>

      <div className='toolbar-section'>
        <button
          onClick={handleUndo}
          className='toolbar-btn'
          disabled={undoStack.length === 0}
        >
          <AiOutlineUndo size={20} />
          <span>Undo</span>
        </button>

        <button
          onClick={handleRedo}
          className='toolbar-btn'
          disabled={redoStack.length === 0}
        >
          <AiOutlineRedo size={20} />
          <span>Redo</span>
        </button>
      </div>

      <div className='toolbar-section'>
        <button onClick={formatGraph} className='toolbar-btn'>
          <MdAutoFixHigh size={20} />
          <span>Auto Layout</span>
        </button>
      </div>

      <div className='dag-status-card'>
        <h4 className='status-heading'>DAG Status</h4>
        {dagValidation.isValid ? (
          <div className='dag-valid'>
            <MdVerified size={20} />
            <span>Valid DAG</span>
          </div>
        ) : (
          <div className='dag-invalid'>
            <MdWarningAmber size={20} />
            <span>Invalid DAG</span>
            <ul>
              {dagValidation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphControls;
