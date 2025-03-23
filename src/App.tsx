import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MindMapNode } from "./components/mind-map-node";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";

/**
 * This example demonstrates how you can remove the attribution from the React Flow renderer.
 * Please only hide the attribution if you are subscribed to React Flow Pro: https://reactflow.dev/pro
 */
const proOptions = { hideAttribution: true };

// カスタムノードタイプを定義
const nodeTypes = {
  mindMapNode: MindMapNode,
};

// 初期ノード
const initialNodes = [
  {
    id: "root",
    type: "mindMapNode",
    data: { label: "Main Idea" },
    position: { x: 250, y: 150 },
  },
];

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 h-full bg-[url('/grass-texture.png')] bg-repeat">
          <ReactFlow
            nodes={initialNodes}
            edges={undefined}
            nodeTypes={nodeTypes}
            fitView
            proOptions={proOptions}
            minZoom={0.5}
            maxZoom={2}
            nodesDraggable={true}
            elementsSelectable={true}
            snapToGrid={true}
            snapGrid={[15, 15]}
          >
            <Background color="#a1a1aa" gap={16} size={1} />
            <Controls className="bg-white/80 p-1 rounded-md border-2 border-amber-500" />
            <MiniMap
              nodeColor={(n) => {
                if (n.id === "root") return "#f97316";
                return "#10b981";
              }}
              maskColor="rgba(255, 255, 255, 0.5)"
              className="bg-white/80 rounded-md border-2 border-amber-500"
            />
          </ReactFlow>
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
