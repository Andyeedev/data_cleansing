import { useState, useRef, useEffect } from 'react';
import type { AIConversationMessage } from '../types/AIRequests';

export interface AIConversationProps {
  messages: AIConversationMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const AIConversation: React.FC<AIConversationProps> = ({
  messages,
  onSendMessage,
  isLoading,
  error
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '32px 16px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Start a conversation with the AI Assistant
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '12px' }}>
              Ask questions, get insights, or request actions
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '8px'
            }}
          >
            {message.role === 'assistant' && (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: 'white', fontSize: '12px' }}>AI</span>
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: message.role === 'user' ? '#3b82f6' : '#f3f4f6',
              color: message.role === 'user' ? 'white' : '#374151',
              fontSize: '13px',
              lineHeight: '1.5',
              wordBreak: 'break-word'
            }}>
              {message.content}
              <div style={{
                fontSize: '10px',
                color: message.role === 'user' ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                marginTop: '4px'
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {message.role === 'user' && (
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: 'white', fontSize: '12px' }}>U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '12px' }}>AI</span>
            </div>
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              gap: '4px'
            }}>
              <span style={{ animation: 'pulse 1.5s infinite', fontSize: '12px' }}>●</span>
              <span style={{ animation: 'pulse 1.5s infinite 0.3s', fontSize: '12px' }}>●</span>
              <span style={{ animation: 'pulse 1.5s infinite 0.6s', fontSize: '12px' }}>●</span>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px',
          backgroundColor: '#ffffff'
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the AI assistant..."
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            resize: 'none',
            fontSize: '13px',
            fontFamily: 'inherit',
            outline: 'none',
            minHeight: '40px',
            maxHeight: '120px'
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            padding: '10px 16px',
            backgroundColor: input.trim() && !isLoading ? '#3b82f6' : '#e5e7eb',
            color: input.trim() && !isLoading ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '8px',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontWeight: 500,
            fontSize: '13px'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIConversation;
