# React Flow DAG Editor

A visual Directed Acyclic Graph (DAG) editor built using [React Flow](https://reactflow.dev/). It allows users to create, connect, delete, and rearrange custom nodes interactively with support for:

- ✅ Adding/removing nodes and edges  
- 🔁 Undo and redo actions  
- 🔄 Auto-layout of graph using Dagre  
- ✅ DAG validation with cycle detection  
- 🖱️ Click-based selection and deletion of nodes/edges  

---

## ✨ Features

- **Custom Nodes**: Nodes with editable labels and custom visuals  
- **Manual Edge Drawing**: Connect nodes via drag-and-drop  
- **Undo / Redo**: Step back and forward through changes  
- **DAG Validation**: Detects cycles and invalid graphs  
- **Auto Layout**: Organizes the graph using [Dagre layout](https://github.com/dagrejs/dagre)  
- **Highlight Selection**: Selected nodes and edges are visually emphasized  
- **Responsive & Clean UI**: Toolbar with all major actions  

---

## 📦 Installation

```bash
git clone https://github.com/your-username/your-dag-editor-repo.git
cd your-dag-editor-repo
npm install
