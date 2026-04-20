import { useState, useEffect } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import type { IntelligenceNode } from './types/intelligence';
import { fetchIntelligenceData } from './data/mockData';

function App() {
  const [nodes, setNodes] = useState<IntelligenceNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<IntelligenceNode | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchIntelligenceData();
        setNodes(data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleAddNode = (newNode: IntelligenceNode) => {
    setNodes(prev => [newNode, ...prev]);
    setSelectedNode(newNode);
  };

  const handleNodeClick = (node: IntelligenceNode) => {
    setSelectedNode(node);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--bg-dark)' }}>
      <Sidebar nodes={nodes} onAddNode={handleAddNode} onNodeClick={handleNodeClick} />
      
      <div style={{ flex: 1, position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-main)' }}>
            <div className="marker-pulse" style={{ width: '40px', height: '40px', borderColor: 'var(--accent-cyan)', '--marker-color': '6, 182, 212' } as any}></div>
          </div>
        ) : (
          <Map nodes={nodes} selectedNode={selectedNode} />
        )}
      </div>
    </div>
  );
}

export default App;
