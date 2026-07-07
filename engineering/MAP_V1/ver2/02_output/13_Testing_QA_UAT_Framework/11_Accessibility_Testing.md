# MAP Accessibility Testing

| Field | Value |
|-------|-------|
| **Document Title** | Accessibility Testing - Migration Assurance Platform (MAP) |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal / Confidential |
| **Owner** | QA Engineering & Accessibility Team |
| **Review Cycle** | Quarterly |

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [WCAG 2.1 AA Compliance Requirements](#2-wcag-21-aa-compliance-requirements)
3. [Keyboard Navigation](#3-keyboard-navigation)
4. [Screen Reader Support](#4-screen-reader-support)
5. [Colour Contrast](#5-colour-contrast)
6. [Responsive Behaviour](#6-responsive-behaviour)
7. [Accessibility Tools and Automation](#7-accessibility-tools-and-automation)
8. [Legal Compliance and Standards](#8-legal-compliance-and-standards)
9. [Test Scenarios and User Journeys](#9-test-scenarios-and-user-journeys)
10. [Reporting and Documentation](#10-reporting-and-documentation)
11. [Dependencies](#11-dependencies)
12. [Revision History](#12-revision-history)
13. [Approval](#13-approval)

---

## 1. Purpose and Scope

### 1.1 Purpose

This document defines the accessibility testing approach, standards, and procedures for the Migration Assurance Platform (MAP). It establishes a comprehensive framework to ensure MAP meets WCAG 2.1 AA compliance, accommodates assistive technology users, and satisfies legal obligations across all supported markets.

### 1.2 Scope

Accessibility testing applies to:

- All MAP web application interfaces (desktop, tablet, mobile)
- Public-facing portals and dashboards
- API documentation and developer portals
- Administrative consoles and configuration screens
- Notification systems and alert mechanisms
- Data visualisation components and reports
- Onboarding and help documentation systems

### 1.3 Accessibility Policy

MAP is committed to digital inclusion. Every feature, page, and interactive element must be perceivable, operable, understandable, and robust for all users, including those relying on assistive technologies.

### 1.4 Key Definitions

| Term | Definition |
|------|------------|
| **AT** | Assistive Technology - software or hardware that enhances accessibility |
| **WCAG** | Web Content Accessibility Guidelines |
| **VPAT** | Voluntary Product Accessibility Template |
| **ARIA** | Accessible Rich Internet Applications |
| **Screen Reader** | AT that converts digital content to speech or Braille output |
| **Focus Indicator** | Visual outline showing the currently active interactive element |
| **Skip Link** | Navigation aid allowing users to bypass repetitive content blocks |

---

## 2. WCAG 2.1 AA Compliance Requirements

### 2.1 Compliance Target

MAP targets **full WCAG 2.1 Level AA** compliance across all user-facing interfaces. Level AAA conformance is aspirational for specific components where achievable without degradation of user experience.

### 2.2 WCAG 2.1 AA Success Criteria

#### 2.2.1 Perceivable

| Criterion | ID | Requirement | MAP Implementation |
|-----------|-----|-------------|-------------------|
| Text Alternatives | 1.1.1 | Non-text content has text alternatives | All images, icons, charts have alt text; decorative images use `alt=""` |
| Audio/Video | 1.2.1 | Captions for pre-recorded audio/video | Closed captions for all training videos, webinars |
| Captions (Live) | 1.2.4 | Captions for live audio | Real-time captioning for live session recordings |
| Audio Description | 1.2.5 | Audio description for pre-recorded video | Description tracks for data visualisation walkthroughs |
| Info and Relationships | 1.3.1 | Information structure conveyed programmatically | Semantic HTML, proper heading hierarchy, ARIA landmarks |
| Meaningful Sequence | 1.3.2 | Reading order is logical | DOM order matches visual order; CSS does not disrupt sequence |
| Sensory Characteristics | 1.3.3 | Instructions do not rely solely on sensory characteristics | Instructions reference labels, not colour or position alone |
| Orientation | 1.3.4 | Content not restricted to single orientation | Portrait and landscape both supported on tablets/mobile |
| Identify Input Purpose | 1.3.5 | Input fields have defined purpose | `autocomplete` attributes on all personal data fields |
| Use of Colour | 1.4.1 | Colour is not sole means of conveying information | Error states use icon + text + colour; charts include patterns |
| Contrast (Minimum) | 1.4.3 | Minimum 4.5:1 contrast ratio (normal text) | Automated and manual contrast verification |
| Contrast (Enhanced) | 1.4.6 | 7:1 ratio for critical content | Enhanced contrast for error messages, status indicators |
| Resize Text | 1.4.4 | Text resizable to 200% without loss | Responsive design, reflow at 400% zoom |
| Reflow | 1.4.10 | Content reflows at 320px width (400% zoom) | No horizontal scrolling required |
| Non-text Contrast | 1.4.11 | 3:1 ratio for UI components and graphics | Focus indicators, form borders, icons meet ratio |
| Text Spacing | 1.4.12 | No loss with adjusted text spacing | Content adapts to increased line-height, letter-spacing |
| Hover/Focus Content | 1.4.13 | Hover/focus content dismissible, persistent, hoverable | Tooltips accessible via keyboard, dismissible with Escape |

#### 2.2.2 Operable

| Criterion | ID | Requirement | MAP Implementation |
|-----------|-----|-------------|-------------------|
| Keyboard | 2.1.1 | All functionality operable via keyboard | No keyboard traps; all actions keyboard-accessible |
| No Keyboard Trap | 2.1.2 | Focus can be moved away from component | Modals allow Escape to close; focus returns to trigger |
| Character Keys | 2.1.4 | Single character key shortcuts remappable/disablable | No single-character shortcuts; all use key combinations |
| Timing Adjustable | 2.2.1 | Time limits adjustable or removable | Session timeout warning with extend option |
| Pause, Stop, Hide | 2.2.2 | Moving content pausable/stoppable/hideable | Auto-refresh dashboards have pause controls |
| Three Flashes | 2.3.1 | No content flashes more than 3 times per second | No flashing elements in any MAP interface |
| Seizure Safe | 2.3.3 | No content causes seizures | Animations respect `prefers-reduced-motion` |
| Bypass Blocks | 2.4.1 | Skip navigation links present | Skip to main content, skip to footer links |
| Page Titled | 2.4.2 | Pages have descriptive titles | Dynamic titles reflect current content/context |
| Focus Order | 2.4.3 | Focus order preserves meaning | Logical tab order matching visual layout |
| Link Purpose | 2.4.4 | Link purpose determinable from text or context | Descriptive link text; `aria-label` for icon links |
| Multiple Ways | 2.4.5 | Multiple navigation mechanisms available | Search, menu, breadcrumbs, sitemap |
| Headings and Labels | 2.4.6 | Headings and labels describe purpose | Descriptive headings at all hierarchy levels |
| Focus Visible | 2.4.7 | Focus indicator clearly visible | High-contrast focus ring on all interactive elements |
| Pointer Gestures | 2.5.1 | Multi-point gestures have single-pointer alternatives | All swipe/pinch actions have button alternatives |
| Pointer Cancellation | 2.5.2 | Actions trigger on up-event, not down-event | Form submissions on mouse-up |
| Label in Name | 2.5.3 | Accessible name contains visible label | ARIA labels match visible button text |
| Motion Actuation | 2.5.4 | Motion-triggered actions have alternatives | Shake-to-undo has button alternative |

#### 2.2.3 Understandable

| Criterion | ID | Requirement | MAP Implementation |
|-----------|-----|-------------|-------------------|
| Language of Page | 3.1.1 | Page language programmatically set | `<html lang="en">` on all pages |
| Language of Parts | 3.1.2 | Language of content segments marked | `lang` attributes on non-English content |
| On Focus | 3.2.1 | No unexpected context change on focus | No navigation triggers on focus events |
| On Input | 3.2.2 | No unexpected context change on input | Form submissions require explicit action |
| Consistent Navigation | 3.2.3 | Navigation consistent across pages | Same header, footer, menu across all pages |
| Consistent Identification | 3.2.4 | Components with same function identified consistently | Same icon/label for same action throughout |
| Error Identification | 3.3.1 | Errors identified and described in text | Form errors displayed with descriptive messages |
| Labels or Instructions | 3.3.2 | Labels or instructions provided | All form fields have visible labels and hints |
| Error Suggestion | 3.3.3 | Error correction suggestions provided | Suggested fixes for common input errors |
| Error Prevention | 3.3.4 | Submissions reversible, validated, or confirmed | Confirmation dialogs for destructive actions |

#### 2.2.4 Robust

| Criterion | ID | Requirement | MAP Implementation |
|-----------|-----|-------------|-------------------|
| Parsing | 4.1.1 | Valid, properly nested HTML | HTML validated; no duplicate IDs |
| Name, Role, Value | 4.1.2 | All UI components expose name/role/value | Custom components use ARIA roles/states |
| Status Messages | 4.1.3 | Status messages announced without focus change | `aria-live` regions for dynamic updates |

### 2.3 Compliance Testing Matrix

```
+--------------------------+-------------------+------------------+-------------------+
| WCAG Principle           | Criteria Count    | Automated Pass % | Manual Pass %     |
+--------------------------+-------------------+------------------+-------------------+
| Perceivable              | 15                | 85%              | 100%              |
| Operable                 | 13                | 70%              | 100%              |
| Understandable           | 9                 | 60%              | 100%              |
| Robust                   | 3                 | 90%              | 100%              |
+--------------------------+-------------------+------------------+-------------------+
| TOTAL                    | 40                | 78%              | 100%              |
+--------------------------+-------------------+------------------+-------------------+
```

---

## 3. Keyboard Navigation

### 3.1 Tab Order Requirements

#### 3.1.1 Default Tab Order

MAP enforces a logical tab order that follows the visual reading direction:

```
+------------------+------------------------------------------+
| Sequence         | Element Group                            |
+------------------+------------------------------------------+
| 1                | Skip navigation link                     |
| 2                | Top navigation bar                       |
| 3                | Search field                              |
| 4                | Main content area (top to bottom)        |
| 5                | Sidebar navigation (if applicable)       |
| 6                | Footer links                             |
| 7                | Footer legal links                       |
+------------------+------------------------------------------+
```

#### 3.1.2 Tab Order Rules

1. **Visible focus indicator** on every interactive element
2. **No tabindex greater than 0** (prevents custom ordering)
3. **Logical DOM order** matches visual layout
4. **Interactive elements only** - non-interactive content excluded from tab order
5. **Consistent patterns** across similar pages

### 3.2 Focus Management

#### 3.2.1 Focus Handling Rules

```javascript
// Example: Focus management for modal dialogs
class AccessibleModal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.previousFocus = null;
    this.focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
  }

  open() {
    this.previousFocus = document.activeElement;
    this.modal.style.display = 'block';
    this.modal.setAttribute('aria-hidden', 'false');
    
    // Focus first focusable element
    const focusable = this.modal.querySelectorAll(this.focusableSelector);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
    
    // Trap focus within modal
    this.modal.addEventListener('keydown', this.trapFocus.bind(this));
  }

  close() {
    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.removeEventListener('keydown', this.trapFocus);
    
    // Return focus to trigger element
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  trapFocus(event) {
    if (event.key !== 'Tab') return;
    
    const focusable = Array.from(
      this.modal.querySelectorAll(this.focusableSelector)
    );
    
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }
}
```

#### 3.2.2 Focus Restoration Map

| User Action | Focus Restores To |
|-------------|-------------------|
| Close modal/dialog | Trigger button or link |
| Dismiss toast notification | Previous focus target |
| Collapse accordion panel | Panel header button |
| Select dropdown item | Dropdown trigger |
| Complete form wizard step | Next logical focus point |
| Cancel inline edit | Edit button |
| Close search overlay | Search trigger button |

### 3.3 Keyboard Shortcuts

#### 3.3.1 MAP Global Keyboard Shortcuts

| Shortcut | Action | Scope |
|----------|--------|-------|
| `Alt + S` | Focus search field | Global |
| `Alt + M` | Toggle main menu | Global |
| `Alt + N` | Focus notifications | Global |
| `Alt + H` | Open help panel | Global |
| `Escape` | Close dialog/overlay/dropdown | Context |
| `Enter` / `Space` | Activate button/link | Context |
| `Arrow Keys` | Navigate within menu/list | Context |
| `Home` / `End` | First/last item in list | Context |
| `Tab` | Move to next focusable element | Global |
| `Shift + Tab` | Move to previous focusable element | Global |
| `Alt + 1-9` | Navigate to numbered tab/section | Dashboard |

#### 3.3.2 Keyboard Shortcut Implementation

```javascript
// Example: Global keyboard shortcut handler
class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.init();
  }

  init() {
    document.addEventListener('keydown', (event) => {
      if (!this.enabled) return;
      
      const key = this.buildKeyString(event);
      const handler = this.shortcuts.get(key);
      
      if (handler) {
        // Only prevent default if handler is registered
        event.preventDefault();
        handler(event);
      }
    });
  }

  buildKeyString(event) {
    const parts = [];
    if (event.altKey) parts.push('Alt');
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.shiftKey) parts.push('Shift');
    parts.push(event.key);
    return parts.join('+');
  }

  register(shortcut, handler) {
    this.shortcuts.set(shortcut, handler);
  }

  deregister(shortcut) {
    this.shortcuts.delete(shortcut);
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }
}

// Usage
const shortcuts = new KeyboardShortcutManager();
shortcuts.register('Alt+S', () => focusSearchField());
shortcuts.register('Alt+M', () => toggleMainNavigation());
shortcuts.register('Escape', (e) => closeCurrentOverlay());
```

### 3.4 Skip Navigation Implementation

```html
<!-- Skip navigation links - placed as first focusable elements -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<a href="#primary-navigation" class="skip-link">
  Skip to navigation
</a>
<a href="#search" class="skip-link">
  Skip to search
</a>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1em;
  background: #000;
  color: #fff;
  text-decoration: underline;
}

.skip-link:focus {
  left: 0;
  top: 0;
}
</style>
```

### 3.5 Keyboard Testing Checklist

| Component | Tab Accessible | Enter/Space Activates | Escape Closes | Arrow Keys Navigate | Focus Visible |
|-----------|:--------------:|:---------------------:|:-------------:|:-------------------:|:-------------:|
| Header navigation | Yes | Yes | Yes | Yes | Yes |
| Search input | Yes | N/A | Clears | N/A | Yes |
| Dropdown menus | Yes | Yes | Yes | Yes | Yes |
| Modal dialogs | Yes | Yes | Yes | N/A | Yes |
| Data tables | Yes | N/A | N/A | Yes | Yes |
| Form fields | Yes | N/A | N/A | N/A | Yes |
| Buttons | Yes | Yes | N/A | N/A | Yes |
| Tabs | Yes | Yes | N/A | Yes | Yes |
| Accordions | Yes | Yes | Yes | N/A | Yes |
| Tooltips | Yes | N/A | Yes | N/A | Yes |
| Pagination | Yes | Yes | N/A | N/A | Yes |
| Toast notifications | Yes | Yes | Yes | N/A | Yes |
| Date picker | Yes | Yes | Yes | Yes | Yes |
| Combobox | Yes | Yes | Yes | Yes | Yes |
| Tree view | Yes | Yes | N/A | Yes | Yes |

---

## 4. Screen Reader Support

### 4.1 ARIA Labels and Roles

#### 4.1.1 Required ARIA Attributes

| Element Type | Required Attributes | Example |
|-------------|-------------------|---------|
| Icon button (no text) | `aria-label` | `<button aria-label="Close dialog">×</button>` |
| Image with alt text | `alt` attribute | `<img src="chart.png" alt="Q3 revenue growth chart">` |
| Decorative image | `alt=""` and `aria-hidden="true"` | `<img src="divider.svg" alt="" aria-hidden="true">` |
| Form field | `aria-label` or `<label>` | `<input aria-label="Email address">` |
| Required field | `aria-required="true"` | `<input aria-required="true">` |
| Error field | `aria-invalid="true" aria-describedby` | `<input aria-invalid="true" aria-describedby="err1">` |
| Live region | `aria-live="polite"` | `<div aria-live="polite" id="status">...</div>` |
| Expanded/collapsed | `aria-expanded` | `<button aria-expanded="false">Menu</button>` |
| Selected state | `aria-selected` | `<tab aria-selected="true">Tab 1</tab>` |
| Disabled state | `aria-disabled="true"` | `<button aria-disabled="true">Disabled</button>` |
| Loading state | `aria-busy="true"` | `<div aria-busy="true">Loading...</div>` |
| Current page | `aria-current="page"` | `<a aria-current="page">Dashboard</a>` |
| Progress | `role="progressbar" aria-valuenow` | `<div role="progressbar" aria-valuenow="60">` |
| Alert | `role="alert"` | `<div role="alert">Error: Invalid input</div>` |
| Status | `role="status"` | `<div role="status">3 results found</div>` |

#### 4.1.2 ARIA Landmark Roles

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Primary navigation -->
    </nav>
    <search role="search" aria-label="Site search">
      <!-- Search form -->
    </search>
  </header>
  
  <main role="main" id="main-content" tabindex="-1">
    <nav aria-label="Breadcrumb">
      <!-- Breadcrumb navigation -->
    </nav>
    
    <aside role="complementary" aria-label="Sidebar">
      <!-- Sidebar content -->
    </aside>
    
    <section role="region" aria-label="Dashboard">
      <!-- Main content -->
    </section>
  </main>
  
  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <!-- Footer links -->
    </nav>
  </footer>
</body>
```

### 4.2 Live Regions and Announcements

#### 4.2.1 Live Region Types

| Type | Usage | Timing | Example |
|------|-------|--------|---------|
| `aria-live="polite"` | Non-urgent updates | After current speech finishes | Search result count update |
| `aria-live="assertive"` | Urgent updates | Interrupts current speech | Error message in form |
| `aria-live="off"` | Suppressed updates | Never announced | Decorative counters |
| `role="alert"` | Alert messages | Immediate announcement | Session timeout warning |
| `role="status"` | Status updates | After current speech | "File saved successfully" |
| `role="log"` | Log entries | After current speech | Activity feed updates |
| `role="timer"` | Timer updates | Announced at intervals | Countdown timer |
| `role="progressbar"` | Progress updates | Announced at intervals | File upload progress |

#### 4.2.2 Announcement Patterns

```javascript
// Announcement utility for screen readers
class ScreenReaderAnnouncer {
  constructor() {
    this.createLiveRegions();
  }

  createLiveRegions() {
    // Polite announcements
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.classList.add('sr-only');
    document.body.appendChild(this.politeRegion);

    // Assertive announcements
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.classList.add('sr-only');
    document.body.appendChild(this.assertiveRegion);

    // Status region
    this.statusRegion = document.createElement('div');
    this.statusRegion.setAttribute('role', 'status');
    this.statusRegion.classList.add('sr-only');
    document.body.appendChild(this.statusRegion);
  }

  announcePolite(message) {
    this.politeRegion.textContent = '';
    // Force DOM reflow to ensure announcement
    setTimeout(() => {
      this.politeRegion.textContent = message;
    }, 100);
  }

  announceAssertive(message) {
    this.assertiveRegion.textContent = '';
    setTimeout(() => {
      this.assertiveRegion.textContent = message;
    }, 100);
  }

  announceStatus(message) {
    this.statusRegion.textContent = '';
    setTimeout(() => {
      this.statusRegion.textContent = message;
    }, 100);
  }

  announceError(message) {
    this.announceAssertive(`Error: ${message}`);
  }

  announceSuccess(message) {
    this.announceStatus(`Success: ${message}`);
  }

  announceNavigation(pageTitle) {
    this.announcePolite(`Navigated to ${pageTitle}`);
  }

  announceLoading(isLoading) {
    if (isLoading) {
      this.announcePolite('Loading, please wait');
    } else {
      this.announcePolite('Content loaded');
    }
  }
}

// Usage examples
const announcer = new ScreenReaderAnnouncer();
announcer.announcePolite('5 search results found');
announcer.announceError('Email address is required');
announcer.announceSuccess('Profile updated successfully');
announcer.announceLoading(true);
```

### 4.3 Screen Reader Testing Matrix

| Screen Reader | Browser | Platform | Priority | Test Frequency |
|--------------|---------|----------|----------|----------------|
| NVDA | Chrome | Windows | P0 | Every release |
| NVDA | Firefox | Windows | P0 | Every release |
| JAWS | Chrome | Windows | P0 | Every release |
| JAWS | Edge | Windows | P1 | Monthly |
| VoiceOver | Safari | macOS | P0 | Every release |
| VoiceOver | Safari | iOS | P1 | Every release |
| TalkBack | Chrome | Android | P1 | Every release |
| Narrator | Edge | Windows | P2 | Quarterly |

### 4.4 Common Screen Reader Issues to Test

| Issue | Description | Test Method |
|-------|-------------|-------------|
| Missing alt text | Images without text alternatives | Check all images for alt attributes |
| Missing form labels | Inputs without associated labels | Verify label associations |
| Missing landmarks | Content not in landmark regions | Validate landmark structure |
| Orphaned headings | Headings not in logical sequence | Check heading hierarchy (h1 > h2 > h3) |
| Auto-playing media | Media plays without user control | Verify no autoplay |
| Hidden but focusable | Visually hidden but keyboard accessible | Tab through page, check focus |
| Dynamic content | Updates not announced | Monitor live regions |
| Modal focus trap | Focus escapes modal | Tab through modal content |
| Data table headers | Tables without proper th/scope | Verify table markup |
| Interactive elements | Custom controls without roles | Check ARIA roles on custom widgets |

---

## 5. Colour Contrast

### 5.1 Minimum Contrast Ratios

| Content Type | Minimum Ratio | Standard | Application |
|-------------|---------------|----------|-------------|
| Normal text (< 18pt) | 4.5:1 | WCAG AA | Body text, labels, links |
| Large text (>= 18pt / 14pt bold) | 3:1 | WCAG AA | Headings, large buttons |
| UI components | 3:1 | WCAG AA | Borders, icons, focus indicators |
| Graphical objects | 3:1 | WCAG AA | Charts, diagrams, infographics |
| Placeholder text | 4.5:1 | MAP policy | Form placeholders |
| Disabled text | Not required | WCAG exception | Explicitly disabled elements |
| Logos | Not required | WCAG exception | Brand logos only |

### 5.2 MAP Colour Palette Compliance

| Colour Role | Hex Value | Contrast on White | Contrast on Dark | Status |
|------------|-----------|-------------------|------------------|--------|
| Primary text | #1A1A2E | 15.4:1 | 2.3:1 (on #0F0F23) | Pass |
| Secondary text | #4A5568 | 7.1:1 | N/A | Pass |
| Link text | #2B6CB0 | 5.2:1 | N/A | Pass |
| Error text | #C53030 | 5.6:1 | N/A | Pass |
| Success text | #276749 | 5.1:1 | N/A | Pass |
| Warning text | #975A16 | 4.6:1 | N/A | Pass |
| Info text | #2C5282 | 5.5:1 | N/A | Pass |
| Primary button bg | #2B6CB0 | 5.2:1 (on white text) | N/A | Pass |
| Secondary button bg | #E2E8F0 | 2.1:1 (on dark text) | N/A | Pass (large text) |
| Focus indicator | #2B6CB0 | 5.2:1 | N/A | Pass |
| Border light | #CBD5E0 | 2.1:1 | N/A | Pass (UI component) |
| Border dark | #2D3748 | 11.4:1 | N/A | Pass |

### 5.3 Colour Contrast Testing Process

```
+-------------------+------------------------+----------------------+
| Step              | Action                 | Tool                 |
+-------------------+------------------------+----------------------+
| 1                 | Identify colour pairs  | Visual inspection    |
| 2                 | Measure ratios         | Colour Contrast      |
|                   |                        | Analyser             |
| 3                 | Document failures      | Accessibility report |
| 4                 | Provide alternatives   | Developer handoff    |
| 5                 | Verify fix             | Re-test with tool    |
| 6                 | Screen reader verify   | NVDA / VoiceOver     |
+-------------------+------------------------+----------------------+
```

### 5.4 Colour Independence Testing

All information conveyed through colour must have a non-colour alternative:

| Element | Colour Indicator | Non-Colour Alternative |
|---------|-----------------|----------------------|
| Error state | Red border/text | Error icon + descriptive text |
| Success state | Green indicator | Checkmark icon + text |
| Warning state | Amber indicator | Warning icon + text |
| Required field | Red asterisk | Text "(required)" |
| Active tab | Highlighted tab | Underline/border + aria-selected |
| Link | Coloured text | Underline + text |
| Chart series | Different colours | Patterns, labels, or legends |
| Validation | Green/red border | Icon + text description |
| Read/unread | Grey/blue | Dot icon + text label |
| Online/offline | Green/grey dot | Status text label |

---

## 6. Responsive Behaviour

### 6.1 Breakpoint Definitions

| Breakpoint | Width Range | Target Device | Layout |
|-----------|-------------|---------------|--------|
| Mobile S | 320px - 374px | Small smartphones | Single column, stacked |
| Mobile L | 375px - 767px | Large smartphones | Single column, expanded |
| Tablet | 768px - 1023px | Tablets, small laptops | Two-column, collapsible sidebar |
| Desktop | 1024px - 1439px | Desktop monitors | Full layout with sidebar |
| Desktop L | 1440px+ | Large monitors | Expanded layout |

### 6.2 Mobile Accessibility Requirements

| Requirement | Implementation | Test Method |
|------------|---------------|-------------|
| Touch target size | Minimum 44x44px for all interactive elements | Measure with dev tools |
| Touch spacing | Minimum 8px between touch targets | Visual inspection |
| Pinch-to-zoom | Content accessible without zoom (reflow at 320px) | Test at 400% zoom |
| Orientation | Both portrait and landscape supported | Test in both orientations |
| Voice control | All actions accessible via voice | Test with voice control |
| Screen reader | Full TalkBack/VoiceOver compatibility | Test with screen readers |
| Haptic feedback | Meaningful actions provide haptic feedback | Test on physical devices |

### 6.3 Responsive Accessibility Matrix

| Component | Mobile | Tablet | Desktop | Notes |
|-----------|--------|--------|---------|-------|
| Navigation | Hamburger menu | Collapsible sidebar | Full horizontal nav | All keyboard accessible |
| Data table | Horizontal scroll + pagination | Full width | Full width | Horizontal scroll has keyboard access |
| Modal | Full-screen overlay | Centered modal | Centered modal | Focus management consistent |
| Form | Full-width stacked | Two-column | Two-column | Labels always visible |
| Toast | Bottom sheet | Bottom right | Top right | Always announced to screen readers |
| Tooltip | Tap to show | Hover to show | Hover to show | Always accessible via keyboard |
| Dropdown | Full-width select | Standard dropdown | Standard dropdown | Custom select keyboard accessible |
| Date picker | Calendar overlay | Calendar overlay | Inline/overlay | Full keyboard navigation |
| File upload | Full-width dropzone | Dropzone + browse | Dropzone + browse | Keyboard file selection |
| Progress bar | Full width | Inline | Inline | ARIA progressbar role |

### 6.4 Responsive Testing Procedures

| Test | Tool | Pass Criteria |
|------|------|---------------|
| Reflow at 320px | Chrome DevTools | No horizontal scrolling at 400% zoom |
| Touch targets | Ruler/measurement | All targets >= 44x44px |
| Orientation | Device rotation | Content reflows correctly |
| Zoom | Browser zoom 200% | No content loss or overlap |
| Mobile screen reader | TalkBack/VoiceOver | All content accessible |
| Mobile keyboard | External keyboard | Full navigation support |
| Mobile focus | Visual inspection | Focus indicators visible |
| Text spacing | CSS override | No content clipping |

---

## 7. Accessibility Tools and Automation

### 7.1 Automated Testing Tools

#### 7.1.1 Axe Core Integration

```javascript
// Automated accessibility testing with Axe
const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

async function runAccessibilityAudit(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url);
  
  const results = await new AxePuppeteer(page)
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'best-practice'
    ])
    .analyze();
  
  // Report violations
  if (results.violations.length > 0) {
    console.log('Accessibility Violations Found:');
    results.violations.forEach(violation => {
      console.log(`
        Rule: ${violation.id}
        Impact: ${violation.impact}
        Description: ${violation.description}
        Help: ${violation.help}
        Nodes: ${violation.nodes.length}
        Tags: ${violation.tags.join(', ')}
      `);
    });
  }
  
  return results;
}
```

#### 7.1.2 Lighthouse CI Configuration

```yaml
# lighthouse-accessibility.yml
extends: lighthouse:default
settings:
  onlyCategories:
    - accessibility
  accessibility:
    threshold: 0.95
  output:
    - html
    - json
    - csv
ci:
  assert:
    assertions:
      accessibility:
        - error
        - minScore: 0.95
      # Specific accessibility audits
      color-contrast:
        - error
        - minScore: 1
      image-alt:
        - error
        - minScore: 1
      label:
        - error
        - minScore: 1
      link-name:
        - error
        - minScore: 1
      html-has-lang:
        - error
        - minScore: 1
      meta-viewport:
        - error
        - minScore: 1
```

### 7.2 Manual Testing Tools

| Tool | Purpose | Platform | Usage |
|------|---------|----------|-------|
| Colour Contrast Analyser | Measure colour contrast ratios | Desktop | Test all colour pairs |
| WAVE | Visual accessibility overlay | Browser extension | Quick page audits |
| Accessibility Insights | End-to-end testing | Browser extension | Guided manual tests |
| NVDA | Screen reader testing | Windows | Full screen reader testing |
| JAWS | Screen reader testing | Windows | Enterprise screen reader |
| VoiceOver | Screen reader testing | macOS/iOS | Apple ecosystem testing |
| TalkBack | Screen reader testing | Android | Mobile screen reader testing |
| Screenreader (Web) | Online screen reader | Web | Quick screen reader checks |
| NoCoffee | Vision simulation | Firefox extension | Test vision impairments |
| HeadingsMap | Heading structure | Browser extension | Verify heading hierarchy |

### 7.3 CI/CD Pipeline Integration

```
+------------------+------------------------+---------------------+
| Stage            | Tool                   | Gate Criteria       |
+------------------+------------------------+---------------------+
| Pre-commit       | ESLint accessibility   | No new violations   |
|                  | plugin                 |                     |
| Build            | HTML validator         | Valid HTML          |
| Unit tests       | Axe-core integration   | No critical errors  |
| Integration      | Playwright a11y        | Score >= 95         |
| E2E              | Lighthouse CI         | Score >= 95         |
| Regression       | WAVE CLI               | No new errors       |
| Staging          | Manual audit           | 100% WCAG AA        |
| Pre-release      | Screen reader test     | All journeys pass   |
| Production       | Monitoring             | No regressions      |
+------------------+------------------------+---------------------+
```

### 7.4 Custom Accessibility ESLint Rules

```javascript
// .eslintrc.accessibility.js
module.exports = {
  plugins: ['jsx-a11y', 'react-accessibility'],
  rules: {
    // Enforce alt text on images
    'jsx-a11y/alt-text': 'error',
    
    // Enforce label on form elements
    'jsx-a11y/label-has-associated-control': 'error',
    
    // Enforce anchor has content
    'jsx-a11y/anchor-has-content': 'error',
    
    // Enforce click events have keyboard events
    'jsx-a11y/click-events-have-key-events': 'error',
    
    // Enforce heading order
    'jsx-a11y/heading-order': 'error',
    
    // Enforce no autoplay media
    'jsx-a11y/media-has-caption': 'error',
    
    // Enforce no positive tabindex
    'jsx-a11y/no-positive-tabindex': 'error',
    
    // Enforce role has required ARIA props
    'jsx-a11y/role-has-required-aria-props': 'error',
    
    // Enforce scope on th
    'jsx-a11y/scope': 'error',
    
    // Enforce tabindex not positive
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    
    // Custom MAP rules
    'react-accessibility/aria-live-polite': 'warn',
    'react-accessibility/focus-indicator': 'error',
    'react-accessibility/semantic-landmarks': 'warn',
  }
};
```

---

## 8. Legal Compliance and Standards

### 8.1 Applicable Standards

| Standard | Jurisdiction | Requirements | MAP Status |
|----------|-------------|--------------|------------|
| WCAG 2.1 AA | Global | Web Content Accessibility Guidelines | Target compliance |
| Section 508 | United States | Federal accessibility requirements | Compliant |
| EN 301 549 | European Union | European accessibility standard | Compliant |
| ADA | United States | Americans with Disabilities Act | Compliant |
| AODA | Canada | Accessibility for Ontarians with Disabilities Act | Compliant |
| DDA | Australia | Disability Discrimination Act | Compliant |
| Equality Act 2010 | United Kingdom | UK equality legislation | Compliant |
| EAA 2025 | European Union | European Accessibility Act | Compliant |
| APCA 6.0 | United States | Proposed accessibility standards | Monitored |

### 8.2 Section 508 Compliance

#### 8.2.1 Section 508 Requirements Mapping

| 508 Standard | WCAG Reference | MAP Implementation |
|-------------|----------------|-------------------|
| 1194.22(a) | 1.1.1 | Text alternatives for all non-text content |
| 1194.22(b) | 1.3.1 | Proper semantic structure |
| 1194.22(c) | 1.4.1 | Colour not sole means of information |
| 1194.22(d) | 2.4.1 | Skip navigation links |
| 1194.22(e) | 1.3.1 | Logical reading order |
| 1194.22(f) | 1.3.1 | Row/column headers in tables |
| 1194.22(g) | 1.3.1 | Data table association |
| 1194.22(h) | 2.4.7 | Keyboard focus visible |
| 1194.22(i) | 2.1.1 | Keyboard accessible |
| 1194.22(j) | 2.1.1 | No keyboard trap |
| 1194.22(k) | 2.2.1 | Timing adjustable |
| 1194.22(l) | 2.2.2 | No strobe/flashing |
| 1194.22(m) | 2.3.1 | No seizure-inducing content |
| 1194.22(n) | 2.4.3 | Logical navigation order |
| 1194.22(o) | 2.4.6 | Descriptive headings |
| 1194.22(p) | 2.4.4 | Clear link purpose |
| 1194.22(q) | 3.2.1 | No unexpected context changes |
| 1194.22(r) | 3.2.2 | Consistent navigation |
| 1194.22(s) | 3.3.1 | Input error identification |
| 1194.22(t) | 3.3.2 | Labels and instructions |

### 8.3 EN 301 549 Compliance

#### 8.3.1 EN 301 549 Clause Mapping

| Clause | Title | MAP Compliance |
|--------|-------|---------------|
| 5 | Generic requirements | Compliant |
| 5.1 | Generality | Compliant |
| 5.2 | Functional performance | Compliant |
| 5.3 | Hardware | N/A (web application) |
| 5.4 | Software | Partially applicable |
| 6 | ICT with two-way voice communication | N/A |
| 7 | ICT with video capabilities | Compliant (captions) |
| 8 | Web browsers | N/A |
| 9 | Web | Compliant (WCAG 2.1 AA) |
| 10 | Non-web documents | Compliant |
| 11 | Software | Partially applicable |
| 12 | Documentation | Compliant |
| 13 | ICT providing relay or emergency service access | N/A |

### 8.4 Legal Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| User complaint to regulator | Medium | High | Regular audits, documented compliance |
| Lawsuit filed | Low | Very High | VPAT, remediation process, insurance |
| Contract non-compliance | Medium | High | Contract accessibility clauses, audits |
| Public relations incident | Low | High | Proactive accessibility communication |
| Government audit | Medium | High | 508 compliance documentation |
| EU EAA non-compliance | Medium | High | EN 301 549 compliance program |

---

## 9. Test Scenarios and User Journeys

### 9.1 Critical User Journeys

#### 9.1.1 Journey: Login and Authentication

| Step | Action | Accessibility Check | AT Required |
|------|--------|-------------------|-------------|
| 1 | Navigate to login page | Page title announced; heading hierarchy | Screen reader |
| 2 | Tab to email field | Label announced; focus visible | Screen reader |
| 3 | Enter email | Input value announced; autocomplete works | Screen reader |
| 4 | Tab to password field | Label announced; required state announced | Screen reader |
| 5 | Enter password | Characters masked; no password visible | Screen reader |
| 6 | Tab to "Remember me" | Checkbox label announced; state announced | Screen reader |
| 7 | Tab to "Login" button | Button label announced | Screen reader |
| 8 | Submit form | Error/success announced via live region | Screen reader |
| 9 | Handle MFA | All prompts accessible; keyboard navigable | Screen reader |
| 10 | Dashboard loads | Page change announced; focus moves to main content | Screen reader |

#### 9.1.2 Journey: Data Migration Setup

| Step | Action | Accessibility Check | AT Required |
|------|--------|-------------------|-------------|
| 1 | Access migration wizard | Step indicator announced | Screen reader |
| 2 | Select source system | Dropdown keyboard accessible; options readable | Screen reader |
| 3 | Configure connection | Form labels visible; error handling accessible | Screen reader |
| 4 | Map fields | Table navigable with keyboard; headers announced | Screen reader |
| 5 | Set validation rules | Form accessible; help text available | Screen reader |
| 6 | Review configuration | Summary accessible; no information lost | Screen reader |
| 7 | Start migration | Progress announced via live region | Screen reader |
| 8 | Monitor progress | Status updates announced; pause control available | Screen reader |
| 9 | Handle errors | Errors announced assertively; remediation clear | Screen reader |
| 10 | View results | Results table navigable; summary announced | Screen reader |

#### 9.1.3 Journey: Report Generation and Export

| Step | Action | Accessibility Check | AT Required |
|------|--------|-------------------|-------------|
| 1 | Navigate to reports | Menu accessible via keyboard | Screen reader |
| 2 | Select report type | Radio buttons/selection accessible | Screen reader |
| 3 | Set date range | Date picker keyboard accessible | Screen reader |
| 4 | Apply filters | Filter state announced | Screen reader |
| 5 | View data table | Table headers associated; navigable | Screen reader |
| 6 | Sort table | Sort state announced | Screen reader |
| 7 | Export report | Export options accessible; format clear | Screen reader |
| 8 | Download file | Download announced; file type clear | Screen reader |

### 9.2 Assistive Technology Test Scenarios

#### 9.2.1 Screen Reader Navigation Tests

| Test ID | Scenario | Expected Behaviour | AT |
|---------|----------|-------------------|-----|
| AT-SR-001 | Navigate by heading | All headings found in correct order | NVDA, JAWS |
| AT-SR-002 | Navigate by landmark | All landmarks identified correctly | NVDA, JAWS |
| AT-SR-003 | Navigate by link | All links announced with purpose | NVDA, JAWS |
| AT-SR-004 | Navigate by form control | All form controls announced with labels | NVDA, JAWS |
| AT-SR-005 | Navigate by table | Table structure announced (rows, columns, headers) | NVDA, JAWS |
| AT-SR-006 | Read page content | Content reads in logical order | NVDA, JAWS |
| AT-SR-007 | Dynamic content update | Live regions announced | NVDA, JAWS |
| AT-SR-008 | Modal dialog opens | Focus moves to modal; modal title announced | NVDA, JAWS |
| AT-SR-009 | Modal dialog closes | Focus returns to trigger; announcement made | NVDA, JAWS |
| AT-SR-010 | Form validation error | Error message announced; focus on error | NVDA, JAWS |

#### 9.2.2 Keyboard-Only Navigation Tests

| Test ID | Scenario | Expected Behaviour |
|---------|----------|-------------------|
| AT-KB-001 | Tab through page | Logical focus order; all interactive elements reachable |
| AT-KB-002 | Activate button | Enter and Space both activate button |
| AT-KB-003 | Navigate dropdown | Arrow keys navigate options; Escape closes |
| AT-KB-004 | Navigate tab list | Arrow keys move between tabs; Tab moves into panel |
| AT-KB-005 | Navigate menu | Arrow keys navigate; Escape closes submenu |
| AT-KB-006 | Close modal | Escape key closes modal |
| AT-KB-007 | Navigate table | Arrow keys move between cells |
| AT-KB-008 | Activate link | Enter key activates link |
| AT-KB-009 | Submit form | Enter submits form from any field |
| AT-KB-010 | Cancel action | Escape cancels in-progress action |

#### 9.2.3 Voice Control Tests

| Test ID | Scenario | Expected Behaviour |
|---------|----------|-------------------|
| AT-VC-001 | "Click [button text]" | Button activated |
| AT-VC-002 | "Click [link text]" | Link activated |
| AT-VC-003 | "Type [text]" in field | Text entered in focused field |
| AT-VC-004 | "Show numbers" | All clickable elements numbered |
| AT-VC-005 | "Scroll down" | Page scrolls |
| AT-VC-006 | "Go to [page name]" | Navigation occurs |
| AT-VC-007 | "Click [label]" on form | Form field focused/activated |
| AT-VC-008 | "Press [key]" | Keyboard key pressed |

### 9.3 Test Scenario Documentation Template

```markdown
## Test Scenario: [Scenario Name]

**Test ID**: AT-[TYPE]-[NUMBER]
**Priority**: P0 / P1 / P2
**Assistive Technology**: [AT tool name]
**Browser**: [Browser name and version]
**Platform**: [OS and version]

### Preconditions
- [ ] User is logged in
- [ ] [Specific page state]
- [ ] [Data setup required]

### Test Steps
1. Navigate to [page/element]
2. [Action with AT]
3. [Expected result]
4. [Next action]

### Expected Results
- [ ] [Result 1]
- [ ] [Result 2]
- [ ] [Result 3]

### Actual Results
[Document actual behaviour]

### Pass/Fail
[ ] Pass  [ ] Fail

### Notes
[Any additional observations]
```

---

## 10. Reporting and Documentation

### 10.1 Accessibility Reports

#### 10.1.1 Report Structure

| Section | Content | Audience |
|---------|---------|----------|
| Executive Summary | Overall compliance status, key findings | Leadership |
| Detailed Findings | All violations with severity, location, fix | Development |
| Screen Reader Results | AT-specific test results | QA Team |
| Recommendations | Prioritised remediation steps | All stakeholders |
| Trend Analysis | Comparison with previous reports | Quality team |

#### 10.1.2 Severity Classification

| Severity | Definition | Response Time | Example |
|----------|-----------|---------------|---------|
| Critical | Prevents access to core functionality for AT users | 24 hours | Keyboard trap; no focus indicator |
| Major | Significant barrier but workaround exists | 72 hours | Missing form labels; poor heading structure |
| Minor | Inconvenient but not blocking | 2 weeks | Redundant link text; missing skip link |
| Advisory | Best practice improvement | Next sprint | Optimised ARIA usage; enhanced descriptions |

#### 10.1.3 Report Format

```
+-----------------------------------------------------------+
| MAP Accessibility Audit Report                            |
| Date: [DATE]                                              |
| Auditor: [NAME]                                           |
| Scope: [PAGES/FEATURES]                                   |
+-----------------------------------------------------------+
| Summary                                                   |
| Total issues: [COUNT]                                     |
| Critical: [COUNT] | Major: [COUNT]                       |
| Minor: [COUNT]    | Advisory: [COUNT]                    |
+-----------------------------------------------------------+
| Compliance Score: [PERCENTAGE]%                           |
| WCAG 2.1 AA Status: [PASS/FAIL]                          |
+-----------------------------------------------------------+
| Detailed Findings                                         |
| [Issue #] | [Severity] | [WCAG Criterion] | [Location]  |
| [Description]                                             |
| [Remediation]                                             |
+-----------------------------------------------------------+
```

### 10.2 VPAT Documentation

#### 10.2.1 VPAT Template Structure

| Section | Description |
|---------|-------------|
| Product Name | MAP - Migration Assurance Platform |
| Product Version | [Current Version] |
| Report Date | [Date] |
| Contact | [Accessibility team email] |
| Evaluation Methods | Automated testing, manual testing, AT testing |
| Applicable Standards | WCAG 2.1 AA, Section 508, EN 301 549 |

#### 10.2.2 VPAT Conformance Level Definitions

| Level | Definition |
|-------|-----------|
| Supports | All features meet accessibility requirements without known issues |
| Partially Supports | Most features meet requirements; some have issues with workarounds |
| Does Not Support | Features do not meet requirements; no workarounds available |
| Not Applicable | Feature not present in product |
| Not Evaluated | Feature not tested |

#### 10.2.3 VPAT Section 508 Table (Abbreviated)

| Criteria | Conformance Level | Remarks |
|----------|------------------|---------|
| 1194.22(a) - Text Alternatives | Supports | All images have appropriate alt text |
| 1194.22(b) - Scripting | Supports | Scripts are accessible |
| 1194.22(c) - Colour | Supports | Colour not sole means of info |
| 1194.22(d) - Scripting Language | Supports | Scripts use WAI-ARIA |
| 1194.22(e) - Tables | Supports | Tables have headers |
| 1194.22(f) - Frames | Supports | No inaccessible frames |
| 1194.22(g) - Timed Content | Supports | Time limits adjustable |
| 1194.22(h) - Audio | Supports | Audio controls available |
| 1194.22(i) - Video | Partially Supports | Captions available; audio description planned |
| 1194.22(j) - Keyboard | Supports | All functionality keyboard accessible |
| 1194.22(k) - No Keyboard Trap | Supports | Focus can be moved freely |
| 1194.22(l) - Time Adjustable | Supports | Session timeout adjustable |
| 1194.22(m) - Pause/Stop/Hide | Supports | Auto-updating content pausable |
| 1194.22(n) - Blinking | Supports | No blinking content |
| 1194.22(o) - Hyperlinks | Supports | Link purpose clear |
| 1194.22(p) - Page Titles | Supports | All pages have descriptive titles |
| 1194.22(q) - Focus Order | Supports | Focus order logical |
| 1194.22(r) - Link Purpose | Supports | Links have descriptive text |
| 1194.22(s) - Navigation | Supports | Multiple navigation methods |
| 1194.22(t) - Headings | Supports | Heading hierarchy correct |
| 1194.22(u) - CSS | Supports | CSS does not disrupt accessibility |
| 1194.22(v) - Resize Text | Supports | Text resizable to 200% |
| 1194.22(w) - Images of Text | Supports | No images of text (except logos) |
| 1194.22(x) - Separation | Supports | Information structure clear |
| 1194.22(y) - Forms | Supports | Forms have labels and instructions |
| 1194.22(z) - Navigation | Supports | Navigable and understandable |
| 1194.22(aa) - Input Focus | Supports | Focus visible on all inputs |
| 1194.22(bb) - Text Equivalents | Supports | All non-text has alternatives |
| 1194.22(cc) - Access Keys | Supports | No conflicting access keys |
| 1194.22(dd) - Marquee | Supports | No marquee elements |
| 1194.22(ee) - Flashing | Supports | Nothing flashes more than 3/sec |

### 10.3 Accessibility Statement

```markdown
# MAP Accessibility Statement

## Our Commitment
MAP is committed to ensuring digital accessibility for people with disabilities.
We continually improve the user experience for everyone and apply the relevant
accessibility standards.

## Standards We Follow
- WCAG 2.1 Level AA
- Section 508 of the Rehabilitation Act
- EN 301 549 European Accessibility Standard

## Current Status
MAP currently meets WCAG 2.1 Level AA conformance for all core functionality.
We conduct regular accessibility audits and remediate identified issues promptly.

## Known Limitations
- [Any known limitations documented here]
- Alternative access methods provided where needed

## Feedback
We welcome your feedback on the accessibility of MAP. Please contact us at:
- Email: accessibility@map-platform.com
- Phone: [Accessibility hotline]

## Assessment Approach
MAP assesses accessibility through:
- Automated testing (Axe, Lighthouse)
- Manual testing by accessibility specialists
- User testing with assistive technology users
- Third-party accessibility audits

## Date of Statement
Last updated: July 2026
```

---

## 11. Dependencies

### 11.1 Batch 10 UX Design System Dependencies

| Component | Dependency | Status | Impact |
|-----------|-----------|--------|--------|
| Button components | Focus indicator styles | Defined | Keyboard testing |
| Form components | Label/error patterns | Defined | Form accessibility |
| Modal components | Focus trap implementation | Defined | Dialog accessibility |
| Navigation components | Landmark structure | Defined | Screen reader navigation |
| Table components | Sort/filter keyboard access | Defined | Data table accessibility |
| Toast components | Live region patterns | Defined | Dynamic content |
| Tooltip components | Keyboard activation | Defined | Tooltip accessibility |
| Date picker | Full keyboard navigation | Defined | Date input accessibility |
| Combobox | ARIA autocomplete pattern | Defined | Search/select accessibility |
| Tree view | Keyboard navigation pattern | Defined | Hierarchical data |
| Colour palette | Contrast-validated colours | Defined | Colour contrast |
| Typography | Scalable font system | Defined | Text resizing |

### 11.2 Batch 11 Frontend Standards Dependencies

| Standard | Dependency | Status | Impact |
|----------|-----------|--------|--------|
| HTML semantics | Semantic element usage | Defined | Screen reader support |
| ARIA patterns | ARIA role implementations | Defined | Widget accessibility |
| Focus management | Focus handling utilities | Defined | Keyboard navigation |
| Live region patterns | Announcement utilities | Defined | Dynamic updates |
| Skip navigation | Skip link implementation | Defined | Navigation |
| Heading hierarchy | Heading structure rules | Defined | Document structure |
| Form validation | Accessible error handling | Defined | Form accessibility |
| Animation | Reduced motion support | Defined | Motion sensitivity |
| Responsive design | Breakpoint definitions | Defined | Mobile accessibility |
| Testing standards | Accessibility test patterns | Defined | QA process |

### 11.3 Cross-Team Dependencies

| Team | Dependency | Coordination |
|------|-----------|-------------|
| Design | Accessible component designs | Weekly design reviews |
| Frontend | ARIA implementations | Sprint accessibility reviews |
| QA | Accessibility test execution | Bi-weekly test cycles |
| Content | Alt text, link text | Content review process |
| Product | Accessibility requirements | Sprint planning inclusion |
| Legal | Compliance documentation | Quarterly compliance reviews |
| Support | Accessibility issue triage | Incident response process |

### 11.4 Dependency Tracking Matrix

```
+---------------------------+------------------+--------+-------------------+
| Dependency                | Owner            | Status | Resolution Date   |
+---------------------------+------------------+--------+-------------------+
| Batch 10 Design System    | Design Team      | Done   | [DATE]            |
| Batch 11 Frontend Std     | Frontend Team    | Done   | [DATE]            |
| Colour Contrast Audit     | Design Team      | Done   | [DATE]            |
| Keyboard Navigation       | Frontend Team    | Done   | [DATE]            |
| Screen Reader Patterns    | Frontend Team    | Done   | [DATE]            |
| Focus Management Utils    | Frontend Team    | Done   | [DATE]            |
| Live Region Patterns      | Frontend Team    | Done   | [DATE]            |
| Testing Framework Setup   | QA Team          | Done   | [DATE]            |
| VPAT Documentation        | Legal Team       | Done   | [DATE]            |
| Training Materials        | Accessibility    | Done   | [DATE]            |
| Third-party Audit         | External Vendor  | Planned| [DATE]            |
+---------------------------+------------------+--------+-------------------+
```

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 01 Jun 2026 | Accessibility Team | Initial draft |
| 0.2 | 08 Jun 2026 | Accessibility Team | Added WCAG criteria tables |
| 0.3 | 15 Jun 2026 | QA Engineering | Added keyboard navigation section |
| 0.4 | 22 Jun 2026 | Frontend Team | Added ARIA patterns and code examples |
| 0.5 | 29 Jun 2026 | Accessibility Team | Added screen reader testing matrix |
| 0.6 | 03 Jul 2026 | QA Engineering | Added test scenarios and user journeys |
| 0.7 | 07 Jul 2026 | Legal Team | Added compliance and VPAT sections |
| 0.8 | 14 Jul 2026 | Accessibility Team | Added colour contrast and responsive sections |
| 0.9 | 21 Jul 2026 | All Teams | Review feedback incorporated |
| 1.0 | 28 Jul 2026 | Accessibility Team | Final version approved |

---

## 13. Approval

### 13.1 Document Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Accessibility Lead | [Name] | [Date] | __________ |
| QA Director | [Name] | [Date] | __________ |
| Frontend Lead | [Name] | [Date] | __________ |
| Product Owner | [Name] | [Date] | __________ |
| Legal Counsel | [Name] | [Date] | __________ |
| VP of Engineering | [Name] | [Date] | __________ |

### 13.2 Review Approval

| Review Cycle | Date | Reviewer | Approved |
|-------------|------|----------|----------|
| Initial Review | [Date] | [Name] | [ ] Yes [ ] No |
| Quarterly Review Q1 2027 | [Date] | [Name] | [ ] Yes [ ] No |
| Quarterly Review Q2 2027 | [Date] | [Name] | [ ] Yes [ ] No |
| Quarterly Review Q3 2027 | [Date] | [Name] | [ ] Yes [ ] No |
| Annual Review 2027 | [Date] | [Name] | [ ] Yes [ ] No |

### 13.3 Distribution

| Recipient | Role | Distribution Method |
|-----------|------|-------------------|
| Engineering Team | Development | Confluence / Internal Wiki |
| QA Team | Testing | Confluence / Internal Wiki |
| Design Team | Design | Confluence / Internal Wiki |
| Product Team | Requirements | Confluence / Internal Wiki |
| Legal Team | Compliance | Email / SharePoint |
| Executive Team | Overview | Email Summary |

---

## Appendix A: Accessibility Glossary

| Term | Definition |
|------|-----------|
| **Accessibility** | Design of products, devices, services, or environments for people with disabilities |
| **Assistive Technology** | Hardware or software that enables people with disabilities to interact with computers |
| **ARIA** | Accessible Rich Internet Applications - WAI specification for dynamic web content |
| **Screen Reader** | AT that converts on-screen content to speech or Braille output |
| **Focus Indicator** | Visual outline showing the currently active interactive element |
| **Keyboard Trap** | Situation where keyboard focus cannot be moved away from a component |
| **Live Region** | ARIA area that announces dynamic content changes to screen readers |
| **Landmark** | ARIA role identifying major content areas (banner, main, navigation, etc.) |
| **Skip Link** | Hidden link at page top that bypasses navigation to main content |
| **Colour Contrast** | Difference in luminance between foreground and background colours |
| **Reflow** | Content adapting to fit viewport without horizontal scrolling |
| **Text Spacing** | CSS adjustments to line-height, letter-spacing, word-spacing, paragraph spacing |
| **VPAT** | Voluntary Product Accessibility Template - document reporting conformance |
| **WCAG** | Web Content Accessibility Guidelines published by W3C WAI |
| **Section 508** | US law requiring federal agencies to make ICT accessible |
| **EN 301 549** | European standard for ICT accessibility requirements |
| **Cognitive Accessibility** | Design consideration for users with cognitive or learning disabilities |
| **Motor Accessibility** | Design consideration for users with motor impairments |
| **Visual Accessibility** | Design consideration for users with visual impairments |
| **Auditory Accessibility** | Design consideration for users with hearing impairments |

---

## Appendix B: Accessibility Testing Checklist

### Pre-Release Checklist

- [ ] All WCAG 2.1 AA criteria verified
- [ ] Automated tests passing (Axe score >= 95%)
- [ ] Lighthouse accessibility score >= 95%
- [ ] Keyboard navigation tested on all pages
- [ ] Screen reader testing completed (NVDA + VoiceOver)
- [ ] Colour contrast verified for all text and UI components
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip navigation links present and functional
- [ ] All form fields have associated labels
- [ ] Error messages are descriptive and announced
- [ ] Dynamic content uses ARIA live regions
- [ ] Modal focus management implemented correctly
- [ ] Heading hierarchy is logical and complete
- [ ] Tables have proper headers and associations
- [ ] Images have appropriate alt text
- [ ] Responsive behaviour verified at all breakpoints
- [ ] Mobile touch targets meet minimum size (44x44px)
- [ ] Text resizable to 200% without loss
- [ ] Content reflows at 320px width
- [ ] Reduced motion preference respected
- [ ] No content flashes more than 3 times per second
- [ ] Page titles are descriptive
- [ ] Language attributes set correctly
- [ ] Multiple navigation methods available
- [ ] VPAT documentation updated
- [ ] Accessibility statement current

---

## Appendix C: Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| WCAG 2.1 Guidelines | https://www.w3.org/TR/WCAG21/ | Standard reference |
| WAI-ARIA Practices | https://www.w3.org/WAI/ARIA/apg/ | ARIA pattern examples |
| Section 508 Standards | https://www.section508.gov/ | US compliance reference |
| EN 301 549 | https://www.etsi.org/deliver/etsi_en/301500_301599/301549/ | EU compliance reference |
| Axe-core Documentation | https://github.com/dequelabs/axe-core | Automated testing |
| Lighthouse Accessibility | https://developers.google.com/web/tools/lighthouse/audits/accessibility | Audit tool |
| WAVE Tool | https://wave.webaim.org/ | Visual accessibility testing |
| NVDA Screen Reader | https://www.nvaccess.org/download/ | Free screen reader |
| VoiceOver Guide | https://support.apple.com/guide/voiceover/welcome/mac | Apple AT guide |
| WebAIM | https://webaim.org/ | Accessibility resources |
| Deque University | https://dequeuniversity.com/ | Accessibility training |
| A11Y Project | https://www.a11yproject.com/ | Accessibility community |

---

*End of Document*

*Document Classification: Internal / Confidential*
*Last Updated: July 2026*
*Next Review: October 2026*
