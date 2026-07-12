# MAP MVP Design System

| Field      | Value                          |
| ---------- | ------------------------------ |
| Document   | MAP MVP Design System          |
| Version    | 1.0                            |
| Date       | June 2026                      |
| Status     | Official                       |

---

## 1. Grid System

12-column responsive grid system.

- **Columns:** 12
- **Gutters:** 16px
- **Max width:** 1440px
- **Breakpoints:**

| Name      | Min Width |
| --------- | --------- |
| xs        | 0px       |
| sm        | 576px     |
| md        | 768px     |
| lg        | 992px     |
| xl        | 1200px    |
| xxl       | 1400px    |

---

## 2. Spacing Scale

Base unit: **4px**. All spacing values are multiples of the base unit.

| Token   | Value |
| ------- | ----- |
| 0       | 0px   |
| 0.5     | 2px   |
| 1       | 4px   |
| 1.5     | 6px   |
| 2       | 8px   |
| 3       | 12px  |
| 4       | 16px  |
| 5       | 20px  |
| 6       | 24px  |
| 8       | 32px  |
| 10      | 40px  |
| 12      | 48px  |
| 16      | 64px  |
| 20      | 80px  |
| 24      | 96px  |

**Usage presets:**

- **Compact:** 8px
- **Standard:** 16px
- **Spacious:** 24px

---

## 3. Containers

| Container           | Max Width | Margin           | Padding    |
| ------------------- | --------- | ---------------- | ---------- |
| Page container      | 1440px    | auto (centered)  | 0 24px     |
| Content container   | —         | —                | 24px       |
| Section container   | —         | margin-bottom 32px | —        |

---

## 4. Cards

**Base styles:** white background, 1px solid `gray-200` (`#e5e7eb`), 8px border-radius, 16px padding.

| Variant    | Description                                      |
| ---------- | ------------------------------------------------ |
| Default    | Standard white card with border                  |
| Interactive| Hover state adds subtle shadow                   |
| Featured   | 3px left border in primary gradient color        |

---

## 5. Forms

- **Layout:** Label above input
- **Gap:** 8px between label and input
- **Input height:** 40px
- **Border:** 1px solid `gray-200`
- **Focus ring:** 2px solid primary color
- **Error state:** 1px solid `red-500`, error message below input

---

## 6. Tables

- **Header:** `gray-50` background, font-weight 600, 2px solid bottom border
- **Rows:** 1px solid `gray-200` bottom border, hover state `gray-50`

| Density     | Row Height | Font Size |
| ----------- | ---------- | --------- |
| Compact     | 32px       | 12px      |
| Standard    | 40px       | 14px      |
| Comfortable | 48px       | 14px      |

---

## 7. Lists

- **Vertical spacing:** 4px between items
- **Item padding:** 12px 16px
- **Hover state:** `gray-50` background
- **Active state:** `primary-50` background

---

## 8. Dialogs

- **Position:** Centered on viewport
- **Width:** 480px
- **Overlay:** `rgba(0, 0, 0, 0.5)`
- **Close button:** Top-right corner
- **Footer actions:** Right-aligned

---

## 9. Notifications

### Toast

- **Position:** Bottom-right
- **Border-left:** 4px, color by severity
- **Auto-dismiss:** 5 seconds

### Banner

- **Position:** Top of page
- **Dismissible:** Yes

---

## 10. Badges

Shape: pill. Font: small text.

| Type    | Background | Text Color |
| ------- | ---------- | ---------- |
| Success | green-50   | green-700  |
| Warning | yellow-50  | yellow-700 |
| Error   | red-50     | red-700    |
| Info    | blue-50    | blue-700   |
| Neutral | gray-100   | gray-700   |

---

## 11. Tabs

- **Indicator:** Bottom border
- **Active:** Primary color text + 2px primary bottom border
- **Inactive:** `gray-500` text

---

## 12. Buttons

### Variants

| Variant   | Background            | Border        | Text     |
| --------- | --------------------- | ------------- | -------- |
| Primary   | Primary gradient      | None          | White    |
| Secondary | White                 | 1px gray-200  | gray-900 |
| Ghost     | Transparent           | None          | gray-700 |
| Danger    | red-600               | None          | White    |

### Sizes

| Size | Height |
| ---- | ------ |
| sm   | 32px   |
| md   | 40px   |
| lg   | 48px   |

### States

- Default
- Hover
- Active
- Disabled
- Loading

---

## 13. Inputs

- **Height:** 40px
- **Padding:** 0 12px
- **Border:** 1px solid `gray-200`
- **Border-radius:** 6px

### Variants

- Text
- Number
- Email
- Password
- Search
- Select
- Textarea
- Checkbox
- Radio
- Switch
- Date picker

---

## 14. Typography

**Font family:** Inter

### Scale

| Token | Size  | Use Case              |
| ----- | ----- | --------------------- |
| xs    | 12px  | Captions, labels      |
| sm    | 14px  | Secondary text        |
| base  | 16px  | Body text             |
| lg    | 18px  | Sub-headings          |
| xl    | 20px  | Section headings      |
| 2xl   | 24px  | Page titles           |
| 3xl   | 30px  | Hero headings         |
| 4xl   | 36px  | Feature headings      |

### Weights

| Weight | Value |
| ------ | ----- |
| Regular| 400   |
| Medium | 500   |
| Semi   | 600   |
| Bold   | 700   |

### Line Heights

| Context   | Value |
| --------- | ----- |
| Body      | 1.5   |
| Headings  | 1.2   |

---

## 15. Colours

### Primary

- `primary-500`: `#667eea`
- `primary-600`: `#764ba2`
- Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Semantic

| Token     | Background | Text     |
| --------- | ---------- | -------- |
| Success   | green-50   | green-700|
| Warning   | yellow-50  | yellow-700|
| Error     | red-50     | red-700  |
| Info      | blue-50    | blue-700 |

### Neutral

| Token   | Hex       |
| ------- | --------- |
| gray-50 | #f9fafb   |
| gray-100| #f3f4f6   |
| gray-200| #e5e7eb   |
| gray-300| #d1d5db   |
| gray-400| #9ca3af   |
| gray-500| #6b7280   |
| gray-600| #4b5563   |
| gray-700| #374151   |
| gray-800| #1f2937   |
| gray-900| #111827   |

---

## 16. Icons

- **Library:** Lucide or Heroicons (outline style)
- **Sizes:** 16px, 20px, 24px
- **Stroke width:** Consistent across all icons (1.5px)

---

## 17. Loading Indicators

| Type             | Description                              |
| ---------------- | ---------------------------------------- |
| Spinner          | Available in small, medium, large        |
| Skeleton screens | Placeholder content while loading        |
| Progress bars    | Horizontal fill indicator                |
| Shimmer effect   | Animated gradient over skeleton content  |

---

## 18. Empty States

- **Layout:** Centered vertically and horizontally
- **Background:** `gray-50`
- **Elements:** Icon + heading + description + action button

---

## 19. Error States

- **Layout:** Error icon + message + retry button
- **Style:** Consistent error page layout across the application
