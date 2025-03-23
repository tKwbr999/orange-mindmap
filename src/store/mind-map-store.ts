import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
  Connection,
  EdgeChange,
  NodeChange,
  type Edge,
  type Node,
} from "@xyflow/react";

// 初期ノード
const initialNodes: Node[] = [
  {
    id: "root",
    type: "mindMapNode",
    data: { label: "Main Idea" },
    position: { x: 250, y: 150 },
  },
];

// 初期エッジ
const initialEdges: Edge[] = [];

// サンプル
const countAtom = atom<number>(0);
/*
  コンポーネントで、useState と同じように使える！
  const [count, setCount] = useAtom(countAtom);
  setCount((c) => c + 1);
  setCount(10);
*/

// ローカルストレージに保存されるアトム
export const nodesAtom = atomWithStorage<Node[]>("mindmap-nodes", initialNodes);
export const edgesAtom = atomWithStorage<Edge[]>("mindmap-edges", initialEdges);

// 選択中のノードを管理するアトム
export const selectedNodeAtom = atom<Node | null>(null);


// ノードを更新するアトム
export const nodesChangeAtom = atom(null, (get, set, changes: NodeChange[]) => {
    set(nodesAtom, applyNodeChanges(changes, get(nodesAtom)));
  });
  
  // エッジを更新するアトム
  export const edgesChangeAtom = atom(null, (get, set, changes: EdgeChange[]) => {
    set(edgesAtom, applyEdgeChanges(changes, get(edgesAtom)));
  });
  
  // ノード接続のアトム
  export const connectAtom = atom(null, (_, set, connection: Connection) => {
    set(edgesAtom, (eds) =>
      addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: "#f6b93b", strokeWidth: 3 },
        },
        eds
      )
    );
  });