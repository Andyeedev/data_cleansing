# MAP Nexus™ AI Framework

## Overview

The AI Framework provides a reusable, provider-independent architecture for AI capabilities across the MAP Nexus™ Enterprise Platform.

## Architecture

```
src/ai/
├── framework/          # Core framework components
│   ├── AIFramework.ts  # Main entry point
│   ├── AIEngine.ts     # Core engine logic
│   ├── AIContext.tsx    # React context for AI state
│   ├── AIRegistry.ts   # Module registry
│   ├── AIPipeline.ts   # Request pipeline
│   ├── AIConfiguration.ts  # Configuration management
│   ├── AISettings.ts   # Settings management
│   ├── AIAudit.ts      # Audit logging
│   ├── AIUsage.ts      # Usage tracking
│   └── AIQuota.ts      # Quota management
├── types/              # Type definitions
│   ├── AIModels.ts     # Model types
│   ├── AIRequests.ts   # Request types
│   └── AIResponses.ts  # Response types
├── providers/          # Provider abstraction
│   └── AIProvider.ts   # Provider interface
├── hooks/              # React hooks
│   ├── useAI.ts        # Main AI hook
│   ├── useAIRegistry.ts    # Registry hook
│   ├── useAIUsage.ts   # Usage hook
│   └── useAIAudit.ts   # Audit hook
├── services/           # Service layer
│   └── AIService.ts    # AI service
├── components/         # UI components
│   ├── AIStatusIndicator.tsx
│   └── AIErrorBoundary.tsx
└── widgets/            # Widget components
    ├── AIStatusWidget.tsx
    ├── AIInsightWidget.tsx
    ├── AIRecommendationWidget.tsx
    └── AIUsageWidget.tsx
```

## Key Features

- **Provider Agnostic**: Supports Azure OpenAI, OpenAI, Claude, Gemini, Ollama
- **Metadata Driven**: Configuration over code
- **Secure**: Role-based access, tenant isolation, audit logging
- **Auditable**: Full request/response tracking
- **Extensible**: Plugin architecture for future modules

## Usage

```tsx
import { AIContextProvider, useAI } from './ai';

// Wrap your app
<AIContextProvider>
  <App />
</AIContextProvider>

// Use in components
const { processRequest, isLoading } = useAI();
```

## Provider Independence

The framework does NOT implement any AI provider. All requests pass through:

```
Portal → AI UI → AI Framework → Provider Adapter → Configured Provider
```

## Supported Providers (when implemented)

- Azure OpenAI
- OpenAI
- Anthropic Claude
- Google Gemini
- Ollama
- Custom Enterprise Models
