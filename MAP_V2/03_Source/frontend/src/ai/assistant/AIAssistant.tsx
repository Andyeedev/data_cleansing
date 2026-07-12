import { useState, useCallback } from 'react';
import { useAIContext } from '../framework/AIContext';
import { AIConversation } from './AIConversation';
import { AIConversationHistory } from './AIConversationHistory';
import { AIContextPanel } from './AIContextPanel';
import { AISuggestionPanel } from './AISuggestionPanel';
import { AICommandPalette } from './AICommandPalette';
import { AINotificationPanel } from './AINotificationPanel';
import { AIUsageDisplay } from './AIUsageDisplay';
import type { AIConversationMessage } from '../types/AIRequests';

type AssistantView = 'chat' | 'history' | 'context' | 'notifications' | 'citations' | 'usage';

const getDemoResponse = (message: string, _portal: string | null): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello! I'm the MAP Nexus™ AI Assistant. I'm currently in **demo mode**. Once an AI provider is connected, I'll be able to provide real insights and recommendations.`;
  }

  if (lowerMessage.includes('help')) {
    return `I can help you with:\n\n• **Summaries** - Get executive, migration, or validation summaries\n• **Insights** - Discover patterns and anomalies in your data\n• **Recommendations** - Get actionable suggestions\n• **Reports** - Generate and explain reports\n• **Navigation** - Help you find what you need\n\nNote: Currently in demo mode. Connect an AI provider for real responses.`;
  }

  if (lowerMessage.includes('summary') || lowerMessage.includes('summarise')) {
    return `📊 **Demo Summary**\n\nThis is a simulated summary response. When connected to an AI provider, I'll provide:\n\n• Migration status overview\n• Key metrics and KPIs\n• Risk highlights\n• Recommended actions\n\nCurrently showing demo data only.`;
  }

  if (lowerMessage.includes('migration')) {
    return `🔄 **Migration Status (Demo)**\n\n• Total Records: 125,000\n• Migrated: 97,500 (78%)\n• Pending: 22,500 (18%)\n• Failed: 5,000 (4%)\n\nEstimated completion: 3 days\n\nThis is demo data. Connect an AI provider for real-time migration insights.`;
  }

  if (lowerMessage.includes('risk') || lowerMessage.includes('alert')) {
    return `⚠️ **Risk Assessment (Demo)**\n\n• High Risk: 2 items\n• Medium Risk: 5 items\n• Low Risk: 12 items\n\nTop concerns:\n1. Data quality issues in Account table\n2. Schema mismatch in Transaction data\n\nThis is demo data. Connect an AI provider for real risk analysis.`;
  }

  return `I received your message: "${message}"\n\nI'm currently in **demo mode**. To get real AI-powered responses, you'll need to connect an AI provider (OpenAI, Claude, Azure OpenAI, etc.).\n\nFor now, try asking about:\n• "summary"\n• "migration"\n• "risk"\n• "help"`;
};

export interface AIAssistantProps {
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'sidebar';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  defaultOpen = false,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentView, setCurrentView] = useState<AssistantView>('chat');
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const context = useAIContext();

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: AIConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    context.addMessage(userMessage);

    context.setLoading(true);
    context.setError(null);

    // Demo mode - simulate AI response
    setTimeout(() => {
      const demoResponse: AIConversationMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: getDemoResponse(message, context.portal),
        timestamp: new Date()
      };
      context.addMessage(demoResponse);
      context.setLoading(false);
    }, 800);
  }, [context]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  const handleCommand = useCallback((command: string) => {
    if (command.startsWith('/')) {
      handleSendMessage(command);
    }
    setShowCommandPalette(false);
  }, [handleSendMessage]);

  const getPositionStyles = (): React.CSSProperties => {
    if (position === 'sidebar') {
      return {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '100vh',
        zIndex: 9999
      };
    }
    return {
      position: 'fixed',
      bottom: '24px',
      right: position === 'bottom-right' ? '24px' : 'auto',
      left: position === 'bottom-left' ? '24px' : 'auto',
      zIndex: 9999
    };
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          aria-label="Open AI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            zIndex: 10000,
            fontSize: '24px'
          }}
        >
          🤖
        </button>
      )}

      {/* Assistant Panel */}
      {isOpen && (
        <div
          style={{
            ...getPositionStyles(),
            backgroundColor: '#ffffff',
            borderRadius: position === 'sidebar' ? 0 : '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>AI Assistant</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setShowCommandPalette(true)}
                aria-label="Command palette"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ⌘K
              </button>
              <button
                onClick={handleToggle}
                aria-label="Close assistant"
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            {(['chat', 'history', 'context', 'notifications'] as AssistantView[]).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  backgroundColor: currentView === view ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: currentView === view ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: currentView === view ? 600 : 400,
                  color: currentView === view ? '#3b82f6' : '#6b7280',
                  textTransform: 'capitalize'
                }}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {currentView === 'chat' && (
              <>
                <AISuggestionPanel onSuggestionClick={handleSuggestionClick} />
                <AIConversation
                  messages={context.conversationHistory}
                  onSendMessage={handleSendMessage}
                  isLoading={context.isLoading}
                  error={context.error}
                />
                <AIUsageDisplay />
              </>
            )}
            {currentView === 'history' && (
              <AIConversationHistory />
            )}
            {currentView === 'context' && (
              <AIContextPanel />
            )}
            {currentView === 'notifications' && (
              <AINotificationPanel />
            )}
          </div>
        </div>
      )}

      {/* Command Palette */}
      {showCommandPalette && (
        <AICommandPalette
          onCommand={handleCommand}
          onClose={() => setShowCommandPalette(false)}
        />
      )}
    </>
  );
};

export default AIAssistant;
