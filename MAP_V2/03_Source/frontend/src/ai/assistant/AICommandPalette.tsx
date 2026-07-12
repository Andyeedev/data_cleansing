import { useState, useEffect, useRef } from 'react';

export interface AICommandPaletteProps {
  onCommand: (command: string) => void;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  action: string;
}

const COMMANDS: Command[] = [
  { id: 'chat', label: 'Ask AI', description: 'Start a conversation', icon: '💬', category: 'General', action: '/ask' },
  { id: 'summary', label: 'Get Summary', description: 'Summarise current context', icon: '📝', category: 'General', action: '/summary' },
  { id: 'insights', label: 'Show Insights', description: 'Display AI insights', icon: '💡', category: 'General', action: '/insights' },
  { id: 'recommendations', label: 'Get Recommendations', description: 'AI recommendations', icon: '🎯', category: 'General', action: '/recommend' },
  { id: 'help', label: 'Help', description: 'Show available commands', icon: '❓', category: 'General', action: '/help' },
  { id: 'home', label: 'Go Home', description: 'Navigate to home', icon: '🏠', category: 'Navigation', action: '/navigate:home' },
  { id: 'executive', label: 'Executive Portal', description: 'Switch to executive', icon: '👔', category: 'Navigation', action: '/navigate:executive' },
  { id: 'operations', label: 'Operations Portal', description: 'Switch to operations', icon: '⚙️', category: 'Navigation', action: '/navigate:operations' },
  { id: 'migration', label: 'Migration Portal', description: 'Switch to migration', icon: '🔄', category: 'Navigation', action: '/navigate:migration' },
  { id: 'reports', label: 'Report Centre', description: 'Open reports', icon: '📊', category: 'Navigation', action: '/navigate:report-centre' },
  { id: 'export', label: 'Export Chat', description: 'Export conversation', icon: '📤', category: 'Actions', action: '/export' },
  { id: 'clear', label: 'Clear Chat', description: 'Clear conversation', icon: '🗑️', category: 'Actions', action: '/clear' },
  { id: 'history', label: 'View History', description: 'Show chat history', icon: '📜', category: 'Actions', action: '/history' }
];

export const AICommandPalette: React.FC<AICommandPaletteProps> = ({
  onCommand,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        onCommand(filteredCommands[selectedIndex].action);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '20vh',
        zIndex: 10001
      }}
    >
      <div style={{
        width: '480px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Input */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '18px', color: '#6b7280' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
          <kbd style={{
            padding: '4px 8px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#6b7280'
          }}>
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
          {filteredCommands.length === 0 ? (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => onCommand(cmd.action)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: index === selectedIndex ? '#f3f4f6' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                  {cmd.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                    {cmd.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {cmd.description}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  color: '#6b7280'
                }}>
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          <span>{filteredCommands.length} commands</span>
          <span>
            <kbd style={{ padding: '2px 4px', backgroundColor: '#f3f4f6', borderRadius: '2px' }}>↑↓</kbd>
            {' '}navigate{' '}
            <kbd style={{ padding: '2px 4px', backgroundColor: '#f3f4f6', borderRadius: '2px' }}>↵</kbd>
            {' '}select
          </span>
        </div>
      </div>
    </div>
  );
};

export default AICommandPalette;
