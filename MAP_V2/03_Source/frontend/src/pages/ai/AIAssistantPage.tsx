import { AIAssistant } from '../../ai/assistant';

export const AIAssistantPage = () => {
  return (
    <div style={{ height: '100%' }}>
      <AIAssistant defaultOpen={true} position="sidebar" />
    </div>
  );
};

export default AIAssistantPage;
