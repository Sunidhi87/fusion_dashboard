import type { IntelligenceNode } from '../types/intelligence';

interface PopupContentProps {
  node: IntelligenceNode;
}

export default function PopupContent({ node }: PopupContentProps) {
  const getColor = () => {
    switch (node.type) {
      case 'OSINT': return 'var(--accent-blue)';
      case 'HUMINT': return 'var(--accent-amber)';
      case 'IMINT': return 'var(--accent-green)';
      default: return 'var(--text-main)';
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span 
          style={{ 
            backgroundColor: getColor(), 
            color: '#000', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontSize: '0.75rem', 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
        >
          {node.type}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {new Date(node.timestamp).toLocaleDateString()}
        </span>
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>
        {node.title}
      </h3>
      
      <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        {node.description}
      </p>

      {node.imageUrl && (
        <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden' }}>
          <img 
            src={node.imageUrl} 
            alt="Intelligence Imagery" 
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {node.tags.map(tag => (
          <span 
            key={tag} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
