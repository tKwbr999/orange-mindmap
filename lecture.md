# Orange Mindmap: ステップバイステップでマインドマップアプリを作る

このチュートリアルでは、React と TypeScript を使用したインタラクティブなマインドマップアプリケーションの構築方法を学びます。プロジェクトは以下の技術スタックを使用します：

- **フレームワーク**: Vite + React + TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Radix UI
- **状態管理**: Jotai
- **ビジュアライゼーション**: ReactFlow (@xyflow/react)
- **デプロイ**: GitHub Actions + GitHub Pages

## 目次

1. [プロジェクトの初期設定](#1-プロジェクトの初期設定)
2. [Tailwind CSS の導入](#2-tailwind-cssの導入)
3. [開発環境の最適化](#3-開発環境の最適化)
4. [UI コンポーネントの導入](#4-uiコンポーネントの導入)
5. [基本コンポーネントの実装](#5-基本コンポーネントの実装)
6. [ReactFlow によるマインドマップの視覚化](#6-reactflowによるマインドマップの視覚化)
7. [Jotai による状態管理の導入](#7-jotaiによる状態管理の導入)
8. [マインドマップ機能の実装](#8-マインドマップ機能の実装)
9. [GitHubPages へのデプロイ設定](#9-githubpagesへのデプロイ設定)

## 1. プロジェクトの初期設定

まず、Vite で React + TypeScript アプリを作成します。

```bash
# Viteを使用したプロジェクト作成
npm create vite@latest orange-mindmap -- --template react-ts
cd orange-mindmap
npm install
```

生成されたプロジェクトには、基本的なファイルが含まれています：

- package.json と package-lock.json (依存関係管理)
- tsconfig.json (TypeScript の設定)
- vite.config.ts (Vite の設定)
- index.html (エントリーポイント)
- src/ ディレクトリ (React のコード)

## 2. Tailwind CSS の導入

次に、TailwindCSS を追加して美しい UI を効率的に作成します。

```bash
# Tailwind CSSとViteプラグインのインストール
npm install tailwindcss @tailwindcss/vite
npx tailwindcss init -p
```

tailwind.config.js を作成：

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

src/index.css を更新して、TailwindCSS を取り込みます：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムスタイルはここに追加 */
```

vite.config.ts に Tailwind プラグインを追加します：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## 3. 開発環境の最適化

開発体験を向上させるため、パス別名（エイリアス）を設定します。

```bash
# Node.js型定義のインストール
npm install -D @types/node
```

tsconfig.json にパスエイリアスを追加：

```json
{
  "compilerOptions": {
    // 既存の設定
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

vite.config.ts にもパスエイリアスを設定：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

UI コンポーネントの設定用に components.json を作成します：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}
```

## 4. UI コンポーネントの導入

RadixUI を使って、アクセシブルで再利用可能な UI コンポーネントを導入します。

```bash
# Radix UIコンポーネントとユーティリティのインストール
npm install @radix-ui/react-dialog @radix-ui/react-separator @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
# lucideアイコンのインストール
npm install lucide-react
```

ユーティリティ関数を作成します。src/lib/utils.ts を作成：

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

必要な UI コンポーネントを実装します。例として、Button コンポーネント（src/components/ui/button.tsx）を作成：

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        outline:
          "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

続いて、Dialog、Input、Separator、Textarea などの同様の UI コンポーネントを作成します。

## 5. 基本コンポーネントの実装

マインドマップアプリに必要な基本コンポーネントを実装します。

### ヘッダーコンポーネント

まず、src/components/header.tsx を作成します：

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pen, Plus, RefreshCw, Trash } from "lucide-react";

// 共通のボタンスタイルを関数化
const getButtonStyle = (type: "blue" | "red" | "green") =>
  cn(
    "flex items-center gap-1 border-2 font-pixel",
    type === "blue" && "border-blue-800 bg-blue-600 hover:bg-blue-700",
    type === "red" && "border-red-800 bg-red-600 hover:bg-red-700",
    type === "green" && "border-emerald-800 bg-green-600 hover:bg-green-700"
  );

export function Header() {
  return (
    <header className="bg-amber-500 border-b-4 border-amber-600 p-2 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold font-pixel text-white mr-4">
          Orange MindMap
        </h1>
      </div>
      <div className="flex space-x-2">
        <Button className={getButtonStyle("blue")}>
          <Pen size={16} /> 編集
        </Button>
        <Button className={getButtonStyle("green")}>
          <Plus size={16} /> 追加
        </Button>
        <Button className={getButtonStyle("red")}>
          <RefreshCw size={16} /> リセット
        </Button>
      </div>
    </header>
  );
}
```

### サイドバーコンポーネント

次に、src/components/sidebar.tsx を作成します：

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Type } from "lucide-react";

// テキストブロック作成コンポーネント
const TextBlockCreator = () => {
  const [text, setText] = useState<string>("");

  const handleAddTextBlock = () => {
    // 後で実装
    console.log("テキストブロック追加:", text);
    setText("");
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <h3 className="font-medium mb-2 flex items-center">
        <Type size={16} className="mr-2" /> テキストブロック作成
      </h3>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="テキストを入力..."
        className="min-h-[100px] mb-2"
      />
      <Button
        onClick={handleAddTextBlock}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        追加
      </Button>
    </div>
  );
};

// 使い方ガイド
const Instructions = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
      <h3 className="font-medium mb-2">使い方</h3>
      <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
        <li>テキストブロックを作成して、マインドマップに追加</li>
        <li>ノードをドラッグ＆ドロップで移動</li>
        <li>ノードをクリックして編集または削除</li>
        <li>「+」ボタンでサブノードを追加</li>
      </ul>
    </div>
  );
};

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 h-screen">
      <TextBlockCreator />
      <Separator className="my-4" />
      <Instructions />
    </div>
  );
}
```

## 6. ReactFlow によるマインドマップの視覚化

ReactFlow を導入して、インタラクティブなマインドマップのビジュアライゼーションを実装します。

```bash
# ReactFlowのインストール
npm install @xyflow/react
```

### マインドマップノードコンポーネント

カスタムノードコンポーネントを作成します。src/components/mind-map-node.tsx を作成：

```tsx
import { memo } from "react";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

type MindMapNodeData = {
  label: string;
};

export const MindMapNode = memo(
  (node: NodeProps & { data: MindMapNodeData }) => {
    const { id, data, selected } = node;

    // これがルートノードかどうかを判断
    const isRoot = id === "root";

    return (
      <>
        {/* ノードに入ってくる接続のハンドル */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-blue-500 border-2 border-white rounded-full"
        />

        {/* ノードの本体 */}
        <div
          className={cn(
            "px-4 py-2 rounded-lg shadow-md border-2 font-medium text-center max-w-[200px] break-words",
            isRoot
              ? "bg-orange-500 text-white border-orange-600"
              : "bg-white border-gray-200",
            selected && "ring-2 ring-blue-500"
          )}
        >
          {data.label}
        </div>

        {/* ノードから出ていく接続のハンドル */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 bg-blue-500 border-2 border-white rounded-full"
        />
      </>
    );
  }
);

MindMapNode.displayName = "MindMapNode";
```

### App コンポーネントの更新

ReactFlow を使用するように App コンポーネントを更新します：

```tsx
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MindMapNode } from "./components/mind-map-node";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";

// ReactFlow属性を非表示にするオプション
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
    data: { label: "メインアイデア" },
    position: { x: 250, y: 0 },
  },
];

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={initialNodes}
            edges={[]}
            nodeTypes={nodeTypes}
            fitView
            proOptions={proOptions}
            minZoom={0.5}
            maxZoom={2}
            defaultEdgeOptions={{
              type: "smoothstep",
              style: {
                stroke: "#374151",
                strokeWidth: 2,
              },
            }}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default App;
```

## 7. Jotai による状態管理の導入

Jotai を導入して、アプリケーション全体の状態管理を実装します。

```bash
# Jotaiのインストール
npm install jotai
```

### ピクセルフォントとアニメーションのスタイルを追加

src/index.css にスタイルを追加：

```css
/* 既存のTailwindディレクティブ */

/* ピクセルフォント */
.font-pixel {
  font-family: "PixelFont", monospace;
}

/* サブトルなパルスアニメーション */
.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
}

@keyframes pulse-subtle {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
```

### マインドマップストアの作成

マインドマップの状態管理のためのストアを作成します。src/store/mind-map-store.ts を作成：

```typescript
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
    data: { label: "メインアイデア" },
    position: { x: 250, y: 0 },
  },
];

// 初期エッジ
const initialEdges: Edge[] = [];

// LocalStorageを使用したノードの永続化
export const nodesAtom = atomWithStorage<Node[]>("mindmap-nodes", initialNodes);

// LocalStorageを使用したエッジの永続化
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
export const connectAtom = atom(null, (get, set, connection: Connection) => {
  set(edgesAtom, (edges) => addEdge(connection, edges));
});

// 新しいノードを追加するアトム
export const addNodeAtom = atom(
  null,
  (
    get,
    set,
    { id, position, data }: Partial<Node> & { data: { label: string } }
  ) => {
    const nodeId = id || `node_${get(nodesAtom).length + 1}`;
    const nodePosition = position || {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };

    set(nodesAtom, (nodes) => [
      ...nodes,
      {
        id: nodeId,
        type: "mindMapNode",
        data,
        position: nodePosition,
      },
    ]);

    return nodeId;
  }
);

// ノードラベルを更新するアトム
export const updateNodeLabelAtom = atom(
  null,
  (get, set, { id, label }: { id: string; label: string }) => {
    set(nodesAtom, (nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }
        return node;
      })
    );
  }
);

// 親ノードの子として新しいノードを追加するアトム
export const addChildNodeAtom = atom(
  null,
  (get, set, { parentId, label }: { parentId: string; label: string }) => {
    // 親ノードを探す
    const parentNode = get(nodesAtom).find((node) => node.id === parentId);
    if (!parentNode) return;

    // 新しいノードのID
    const newNodeId = `node_${get(nodesAtom).length + 1}`;

    // 親ノードの位置から少し下にずらした位置
    const newPosition = {
      x: parentNode.position.x + Math.random() * 100 - 50,
      y: parentNode.position.y + 100,
    };

    // ノードを追加
    set(addNodeAtom, {
      id: newNodeId,
      position: newPosition,
      data: { label },
    });

    // エッジを追加（親と子をつなぐ）
    set(edgesAtom, (edges) => [
      ...edges,
      {
        id: `edge_${parentId}_${newNodeId}`,
        source: parentId,
        target: newNodeId,
      },
    ]);

    return newNodeId;
  }
);

// ノードとそれに関連するエッジを削除するアトム
export const deleteNodeAtom = atom(null, (get, set, nodeId: string) => {
  // ノードを削除
  set(nodesAtom, (nodes) => nodes.filter((node) => node.id !== nodeId));

  // 関連するエッジを削除
  set(edgesAtom, (edges) =>
    edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
  );
});

// テキストブロックを追加するアトム
export const addTextBlockAtom = atom(null, (get, set, text: string) => {
  const nodes = get(nodesAtom);
  const newNodeId = `node_${nodes.length + 1}`;

  // 既存のノードと重ならない位置を見つける
  const newNode = {
    id: newNodeId,
    type: "mindMapNode",
    data: { label: text },
    position: {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    },
  };

  set(nodesAtom, [...nodes, newNode]);
  return newNodeId;
});

// マインドマップをリセットするアトム
export const resetMindMapAtom = atom(null, (get, set) => {
  set(nodesAtom, initialNodes);
  set(edgesAtom, initialEdges);
});
```

## 8. マインドマップ機能の実装

これまで作成したコンポーネントとストアを統合して、マインドマップ機能を実装します。

### App コンポーネントにストアを統合

```tsx
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MindMapNode } from "./components/mind-map-node";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { useAtom } from "jotai";
import {
  nodesAtom,
  edgesAtom,
  nodesChangeAtom,
  edgesChangeAtom,
  connectAtom,
  selectedNodeAtom,
} from "./store/mind-map-store";

const proOptions = { hideAttribution: true };

// カスタムノードタイプを定義
const nodeTypes = {
  mindMapNode: MindMapNode,
};

function App() {
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const [, setSelectedNode] = useAtom(selectedNodeAtom);
  const [, onNodesChange] = useAtom(nodesChangeAtom);
  const [, onEdgesChange] = useAtom(edgesChangeAtom);
  const [, onConnect] = useAtom(connectAtom);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node)}
            nodeTypes={nodeTypes}
            fitView
            proOptions={proOptions}
            minZoom={0.5}
            maxZoom={2}
            defaultEdgeOptions={{
              type: "smoothstep",
              style: {
                stroke: "#374151",
                strokeWidth: 2,
              },
            }}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### Sidebar コンポーネントの機能実装

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Type } from "lucide-react";
import { addTextBlockAtom } from "@/store/mind-map-store";
import { useAtom } from "jotai";

// テキストブロック作成コンポーネント
const TextBlockCreator = () => {
  const [text, setText] = useState<string>("");
  const [, onAddBlock] = useAtom(addTextBlockAtom);

  const handleAddTextBlock = () => {
    if (text.trim()) {
      onAddBlock(text);
      setText("");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <h3 className="font-medium mb-2 flex items-center">
        <Type size={16} className="mr-2" /> テキストブロック作成
      </h3>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="テキストを入力..."
        className="min-h-[100px] mb-2"
      />
      <Button
        onClick={handleAddTextBlock}
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={!text.trim()}
      >
        追加
      </Button>
    </div>
  );
};

// 残りのコードは同じ...
```

### Header コンポーネントに編集・リセット機能を追加

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pen, Plus, RefreshCw, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  addChildNodeAtom,
  deleteNodeAtom,
  updateNodeLabelAtom,
  resetMindMapAtom,
  selectedNodeAtom,
} from "@/store/mind-map-store";
import { useAtom } from "jotai";
import { useState } from "react";

// 共通のボタンスタイルを関数化
const getButtonStyle = (type: "blue" | "red" | "green") =>
  cn(
    "flex items-center gap-1 border-2 font-pixel",
    type === "blue" && "border-blue-800 bg-blue-600 hover:bg-blue-700",
    type === "red" && "border-red-800 bg-red-600 hover:bg-red-700",
    type === "green" && "border-emerald-800 bg-green-600 hover:bg-green-700"
  );

export function Header() {
  const [selectedNode] = useAtom(selectedNodeAtom);
  const [, updateNodeLabel] = useAtom(updateNodeLabelAtom);
  const [, addChildNode] = useAtom(addChildNodeAtom);
  const [, deleteNode] = useAtom(deleteNodeAtom);
  const [, resetMindMap] = useAtom(resetMindMapAtom);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [nodeLabel, setNodeLabel] = useState("");
  const [childLabel, setChildLabel] = useState("");

  // 編集ダイアログを開く
  const openEditDialog = () => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label);
      setEditDialogOpen(true);
    }
  };

  // ノードを更新
  const handleUpdateNode = () => {
    if (selectedNode && nodeLabel.trim()) {
      updateNodeLabel({ id: selectedNode.id, label: nodeLabel });
      setEditDialogOpen(false);
    }
  };

  // 子ノードを追加
  const handleAddChildNode = () => {
    if (selectedNode && childLabel.trim()) {
      addChildNode({ parentId: selectedNode.id, label: childLabel });
      setAddDialogOpen(false);
      setChildLabel("");
    }
  };

  // 選択中のノードを削除
  const handleDeleteNode = () => {
    if (selectedNode && selectedNode.id !== "root") {
      deleteNode(selectedNode.id);
    }
  };

  return (
    <header className="bg-amber-500 border-b-4 border-amber-600 p-2 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold font-pixel text-white mr-4">
          Orange MindMap
        </h1>
      </div>
      <div className="flex space-x-2">
        <Button
          className={getButtonStyle("blue")}
          onClick={openEditDialog}
          disabled={!selectedNode}
        >
          <Pen size={16} /> 編集
        </Button>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ノードの編集</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                placeholder="ノードのラベル"
              />
              <div className="flex space-x-2">
                <Button onClick={handleUpdateNode}>更新</Button>
                {selectedNode?.id !== "root" && (
                  <Button variant="outline" onClick={handleDeleteNode}>
                    削除
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          className={getButtonStyle("green")}
          onClick={() => setAddDialogOpen(true)}
          disabled={!selectedNode}
        >
          <Plus size={16} /> 追加
        </Button>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>子ノードの追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                value={childLabel}
                onChange={(e) => setChildLabel(e.target.value)}
                placeholder="子ノードのラベル"
              />
              <Button onClick={handleAddChildNode}>追加</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button className={getButtonStyle("red")} onClick={resetMindMap}>
          <RefreshCw size={16} /> リセット
        </Button>
      </div>
    </header>
  );
}
```

## 9. GitHubPages へのデプロイ設定

プロジェクトを GitHubPages で公開するための設定を行います。

### GitHub Actions ワークフローの設定

.github/workflows/deploy-gh-pages.yml を作成します：

```yaml
# 静的コンテンツを GitHub Pages にデプロイするためのシンプルなワークフロー
name: Deploy static content to Pages

on:
  # デフォルトブランチを対象としたプッシュ時にで実行されます
  push:
    branches: ["main"]

  # Actions タブから手動でワークフローを実行できるようにします
  workflow_dispatch:

# GITHUB_TOKEN のパーミッションを設定し、GitHub Pages へのデプロイを許可します
permissions:
  contents: read
  pages: write
  id-token: write

# 1つのデプロイメントだけを許可します
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # ビルドジョブ
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  # デプロイジョブ
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### vite.config.ts に base パスを追加

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// GitHubページのリポジトリ名
const repoName = "orange-mindmap";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === "production" ? `/${repoName}/` : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## まとめ

これで、React と TypeScript を使用したインタラクティブなマインドマップアプリケーションが完成しました。このアプリケーションでは：

1. Vite で高速な開発環境を設定
2. TailwindCSS で効率的なスタイリング
3. RadixUI でアクセシブルな UI コンポーネントを実装
4. ReactFlow でインタラクティブなマインドマップの視覚化
5. Jotai でシンプルな状態管理
6. GitHub Actions で自動デプロイ

今後の拡張アイデア：

- マインドマップのエクスポート/インポート機能
- テーマ切り替え機能
- 複数のマインドマップの管理
- ドラッグ＆ドロップでのノードの再配置アニメーション改善

このプロジェクトを通じて、モダンな React アプリケーションの構築方法を学び、それぞれのライブラリやツールの使い方を実践的に理解できます。
