import { useState } from 'react';
import { useAIContext } from '../framework/AIContext';
import type { AIConversationMessage } from '../types/AIRequests';

export const AIConversationHistory: React.FC = () => {
  const context = useAIContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = context.conversationHistory.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const exportData = context.conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString()
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleExport}
          disabled={context.conversationHistory.length === 0}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: context.conversationHistory.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          Export
        </button>
        <button
          onClick={() => context.clearHistory()}
          disabled={context.conversationHistory.length === 0}
          style={{
            padding: '8px 12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            cursor: context.conversationHistory.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            color: '#dc2626'
          }}
        >
          Clear
        </button>
      </div>

      {/* Messages List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {filteredMessages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '32px 16px'
          }}>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {searchQuery ? 'No matching messages' : 'No conversation history'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredMessages.map((msg: AIConversationMessage) => (
              <div
                key={msg.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: msg.role === 'user' ? '#eff6ff' : '#f9fafb',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: msg.role === 'user' ? '#3b82f6' : '#6b7280',
                    textTransform: 'capitalize'
                  }}>
                    {msg.role}
                  </span>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                    {msg.timestamp.toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '11px',
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        {context.conversationHistory.length} messages
      </div>
    </div>
  );
};

export default AIConversationHistory;
