import '@testing-library/jest-dom/vitest';
import * as axe from 'axe-core';

// Pre-populate localStorage with mock auth so ProtectedRoute passes in tests
const mockUser = {
  id: '1',
  email: 'admin@test.com',
  name: 'admin',
  roles: ['admin'],
  permissions: ['read', 'write', 'delete', 'admin'],
};

localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
localStorage.setItem('map_nexus_user', JSON.stringify(mockUser));

// Accessibility testing utilities
export async function expectNoA11yViolations(container: HTMLElement) {
  const results = await axe.run(container);
  const violations = results.violations;
  
  if (violations.length > 0) {
    const violationMessages = violations.map(v => {
      const nodes = v.nodes.map(n => `  - ${n.html}\n    ${n.failureSummary}`).join('\n');
      return `[${v.impact}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n${nodes}`;
    }).join('\n\n');
    
    throw new Error(`Accessibility violations found:\n\n${violationMessages}`);
  }
  
  return results;
}

export async function checkA11y(container: HTMLElement, options?: axe.RunOptions) {
  return axe.run(container, options ?? {});
}
