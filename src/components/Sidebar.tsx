import { useState, useCallback, useRef } from 'react';
import { Upload, Database } from 'lucide-react';
import type { IntelligenceNode } from '../types/intelligence';

interface SidebarProps {
  nodes: IntelligenceNode[];
  onAddNode: (node: IntelligenceNode) => void;
  onNodeClick: (node: IntelligenceNode) => void;
}

export default function Sidebar({ nodes, onAddNode, onNodeClick }: SidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `Uploaded: ${file.name}`);
    formData.append('type', file.type.includes('image') ? 'IMINT' : 'HUMINT');
    
    // Add slight randomization to coordinate for demonstration
    formData.append('latitude', (34.0522 + (Math.random() - 0.5) * 0.1).toString());
    formData.append('longitude', (-118.2437 + (Math.random() - 0.5) * 0.1).toString());
    formData.append('source', 'Manual Upload (via Backend)');

    try {
      const res = await fetch('/api/intelligence/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const newNode = await res.json();
        onAddNode(newNode);
      } else {
        console.error('Failed to upload file to backend');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [onAddNode]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFile(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-panel" style={{ 
      width: '380px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderLeft: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      zIndex: 10,
      position: 'relative'
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={24} color="var(--accent-cyan)" />
          Fusion Engine
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Strategic Intelligence Common Operating Picture
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Data Ingestion
        </h2>
        
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
            borderRadius: '12px',
            padding: '32px 16px',
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(6, 182, 212, 0.1)' : 'rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInputChange} 
            style={{ display: 'none' }} 
            accept="image/*,.csv,.json"
          />
          <Upload size={32} color={isDragging ? "var(--accent-cyan)" : "var(--text-muted)"} style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>Drag & Drop Files</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>CSV, JSON, or JPG/PNG supported</p>
        </div>

        <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Active Nodes ({nodes.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nodes.map(node => (
            <div 
              key={node.id} 
              onClick={() => onNodeClick(node)}
              style={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '8px', 
              padding: '12px',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ 
                width: '4px', 
                borderRadius: '4px',
                backgroundColor: node.type === 'OSINT' ? 'var(--accent-blue)' : node.type === 'HUMINT' ? 'var(--accent-amber)' : 'var(--accent-green)'
              }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 4px 0' }}>{node.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{node.type}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(node.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
