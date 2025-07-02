// src/CustomNode.js
import { Handle, Position } from 'reactflow';
import './index.css';

function CustomNode({ data }) {
    return (
        <div className="custom-node">
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={true}
                id="a"
                style={{ background: 'blue',  }}
            />
            <div>{data.label}</div>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={true}
                id="a"
                style={{ background: 'red' }}
            />
        </div>
    );
}

export default CustomNode;
