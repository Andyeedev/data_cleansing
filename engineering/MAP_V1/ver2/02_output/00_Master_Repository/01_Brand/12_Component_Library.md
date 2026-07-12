# MAP MVP Component Library

| Field      | Value                          |
| ---------- | ------------------------------ |
| Document   | MAP MVP Component Library      |
| Version    | 1.0                            |
| Date       | June 2026                      |
| Status     | Official                       |

---

## 1. Button

### Props

| Prop           | Type                    | Default    | Description                        |
| -------------- | ----------------------- | ---------- | ---------------------------------- |
| variant        | string                  | "primary"  | "primary" \| "secondary" \| "ghost" \| "danger" |
| size           | string                  | "md"       | "sm" \| "md" \| "lg"              |
| disabled       | boolean                 | false      | Disables the button                |
| loading        | boolean                 | false      | Shows spinner, disables interaction|
| icon           | ReactNode               | —          | Optional icon element              |
| iconPosition   | string                  | "left"     | "left" \| "right"                  |
| fullWidth      | boolean                 | false      | Stretches to container width       |
| children       | ReactNode               | —          | Button label                       |
| onClick        | () => void              | —          | Click handler                      |

### Usage Guidelines

- Use **primary** for main actions (submit, confirm, save).
- Use **secondary** for secondary actions (cancel, close).
- Use **ghost** for minimal emphasis (inline actions).
- Use **danger** for destructive actions (delete, remove).
- Always provide a loading state for async operations.
- Never disable a button without a loading state; prefer removing it from the DOM.

---

## 2. DataTable

### Props

| Prop         | Type              | Default | Description                          |
| ------------ | ----------------- | ------- | ------------------------------------ |
| columns      | Column[]          | —       | Column definitions                   |
| data         | object[]          | —       | Row data array                       |
| sortable     | boolean           | false   | Enable column sorting                |
| filterable   | boolean           | false   | Enable column filtering              |
| paginated    | boolean           | false   | Enable pagination                    |
| selectable   | boolean           | false   | Enable row selection (checkboxes)    |
| density      | string            | "standard" | "compact" \| "standard" \| "comfortable" |
| emptyState   | ReactNode         | —       | Custom empty state content           |
| onSort       | (col, dir) => void| —       | Sort callback                        |
| onPageChange | (page) => void    | —       | Page change callback                 |
| onSelectionChange | (rows) => void | —     | Selection change callback            |

### Column Types

| Type     | Description                        |
| -------- | ---------------------------------- |
| text     | Plain text                         |
| number   | Right-aligned numeric              |
| date     | Formatted date                     |
| status   | Badge indicator                    |
| actions  | Action buttons/cells               |
| custom   | Custom render function             |

### Sorting

- Click column header to sort ascending.
- Click again to sort descending.
- Third click clears sort on that column.

### Pagination

- Default page size: 20 rows.
- Options: 10, 20, 50, 100.
- Displayed below the table.

---

## 3. Card

### Props

| Prop      | Type       | Default   | Description                        |
| --------- | ---------- | --------- | ---------------------------------- |
| variant   | string     | "default" | "default" \| "interactive" \| "featured" |
| padding   | number     | 16        | Inner padding in px                |
| hoverable | boolean    | false     | Enables hover shadow effect        |
| onClick   | () => void | —         | Click handler (makes card clickable)|

### Slots

| Slot    | Description                          |
| ------- | ------------------------------------ |
| Header  | Top section (title, actions)         |
| Content | Main body content                    |
| Footer  | Bottom section (actions, metadata)   |

---

## 4. Modal

### Props

| Prop    | Type       | Default | Description                         |
| ------- | ---------- | ------- | ----------------------------------- |
| open    | boolean    | false   | Controls modal visibility           |
| title   | string     | —       | Modal header title                  |
| size    | string     | "md"    | "sm" \| "md" \| "lg" \| "xl"       |
| onClose | () => void | —       | Called on close/escape/overlay click |
| footer  | ReactNode  | —       | Custom footer content               |
| children| ReactNode  | —       | Modal body content                  |

### Behavior

- **Focus trap:** Focus is trapped inside the modal when open.
- **Escape key:** Closes the modal.
- **Overlay click:** Closes the modal.
- **Body scroll:** Locked when modal is open.

---

## 5. Alert / Toast

### Props

| Prop         | Type       | Default | Description                          |
| ------------ | ---------- | ------- | ------------------------------------ |
| type         | string     | "info"  | "success" \| "warning" \| "error" \| "info" |
| title        | string     | —       | Alert title                          |
| message      | string     | —       | Alert body message                   |
| duration     | number     | 5000    | Auto-dismiss delay in ms (0 = no auto-dismiss) |
| dismissible  | boolean    | true    | Shows close button                   |
| action       | object     | —       | { label: string, onClick: () => void } |

### Behavior

- **Auto-dismiss:** Toasts auto-dismiss after `duration` ms.
- **Stacking:** Multiple toasts stack vertically, newest on top.
- **Banner:** Page-level alerts fixed to top, dismissible.

---

## 6. ProgressBar

### Props

| Prop       | Type   | Default   | Description                         |
| ---------- | ------ | --------- | ----------------------------------- |
| value      | number | 0         | Current progress value              |
| max        | number | 100       | Maximum value                       |
| variant    | string | "primary" | "primary" \| "success" \| "warning" \| "error" |
| size       | string | "md"      | "sm" \| "md" \| "lg"               |
| label      | string | —         | Accessible label text               |
| showValue  | boolean| false     | Display percentage text             |

---

## 7. Charts

### Supported Types

| Type | Description                            |
| ---- | -------------------------------------- |
| Line | Line chart with optional area fill     |
| Bar  | Vertical or horizontal bar chart       |
| Pie  | Standard pie chart                     |
| Area | Filled area chart                      |
| Donut| Pie chart with center cutout           |

### Props

| Prop       | Type    | Default | Description                        |
| ---------- | ------- | ------- | ---------------------------------- |
| type       | string  | —       | Chart type                         |
| data       | object  | —       | Chart data configuration           |
| options    | object  | —       | Chart-specific options             |
| responsive | boolean | true    | Responsive sizing                   |
| tooltip    | boolean | true    | Enable hover tooltips              |

---

## 8. SearchInput

### Props

| Prop        | Type              | Default   | Description                       |
| ----------- | ----------------- | --------- | --------------------------------- |
| placeholder | string            | "Search..." | Input placeholder                |
| value       | string            | —         | Controlled input value            |
| onChange    | (value) => void   | —         | Input change handler              |
| onSearch    | (value) => void   | —         | Search submit handler (Enter)     |
| loading     | boolean           | false     | Shows loading spinner             |
| debounce    | number            | 300       | Debounce delay in ms              |

### Behavior

- Keyboard shortcut hint displayed (Ctrl+K or Cmd+K).
- Enter key triggers `onSearch`.
- Optional debounce on `onChange`.

---

## 9. FilterBar

### Props

| Prop            | Type              | Default | Description                     |
| --------------- | ----------------- | ------- | ------------------------------- |
| filters         | Filter[]          | —       | Available filter definitions     |
| activeFilters   | FilterValue[]     | —       | Currently active filters         |
| onFilterChange  | (filters) => void | —       | Called when filters change        |
| onClearAll      | () => void        | —       | Clears all active filters         |

### Filter Types

| Type       | Description                                |
| ---------- | ------------------------------------------ |
| text       | Free-text search field                     |
| select     | Single-value dropdown                      |
| dateRange  | Start date + end date picker               |
| multiSelect| Multi-value dropdown with checkboxes       |

---

## 10. DropdownMenu

### Props

| Prop      | Type       | Default | Description                        |
| --------- | ---------- | ------- | ---------------------------------- |
| trigger   | ReactNode  | —       | Element that opens the dropdown    |
| items     | MenuItem[] | —       | Menu item definitions              |
| placement | string     | "bottom-start" | "top" \| "bottom" \| "left" \| "right" |

### MenuItem Structure

| Property | Type       | Description                     |
| -------- | ---------- | ------------------------------- |
| label    | string     | Display text                    |
| icon     | ReactNode  | Optional leading icon           |
| onClick  | () => void | Click handler                   |
| divider  | boolean    | Renders a separator line        |
| group    | string     | Groups items under a heading    |
| disabled | boolean    | Greys out the item              |

---

## 11. Accordion

### Props

| Prop        | Type       | Default | Description                        |
| ----------- | ---------- | ------- | ---------------------------------- |
| items       | AccordionItem[] | —  | Panel definitions                  |
| multiple    | boolean    | false   | Allow multiple panels open         |
| defaultOpen | number[]   | —       | Indices of initially open panels   |

### AccordionItem Structure

| Property  | Type       | Description                     |
| --------- | ---------- | ------------------------------- |
| title     | string     | Panel header text               |
| content   | ReactNode  | Panel body content              |
| icon      | ReactNode  | Optional header icon            |
| disabled  | boolean    | Prevents toggle                 |

### Behavior

- Smooth expand/collapse animation (200ms ease).
- Chevron icon rotates on toggle.

---

## 12. Tabs

### Props

| Prop      | Type       | Default | Description                        |
| --------- | ---------- | ------- | ---------------------------------- |
| items     | TabItem[]  | —       | Tab definitions                    |
| activeTab | string     | —       | Currently active tab ID            |
| onChange  | (id) => void | —     | Tab change callback                |

### TabItem Structure

| Property | Type       | Description                     |
| -------- | ---------- | ------------------------------- |
| id       | string     | Unique tab identifier           |
| label    | string     | Tab label text                  |
| icon     | ReactNode  | Optional leading icon           |
| badge    | number     | Badge count displayed on tab    |
| disabled | boolean    | Prevents selection              |
| content  | ReactNode  | Tab panel content               |

---

## 13. TreeView

### Props

| Prop       | Type       | Default | Description                       |
| ---------- | ---------- | ------- | --------------------------------- |
| data       | TreeNode[] | —       | Tree data structure               |
| selectable | boolean    | false   | Enable node selection             |
| expandable | boolean    | true    | Enable expand/collapse            |
| draggable  | boolean    | false   | Enable drag-and-drop reordering   |
| onSelect   | (node) => void | —   | Selection callback                |
| onExpand   | (node) => void | —   | Expand/collapse callback          |
| onDrag     | (node, target) => void | — | Drag-and-drop callback       |

### TreeNode Structure

| Property | Type       | Description                     |
| -------- | ---------- | ------------------------------- |
| id       | string     | Unique node identifier          |
| label    | string     | Display text                    |
| icon     | ReactNode  | Optional node icon              |
| children | TreeNode[] | Nested child nodes              |
| expanded | boolean    | Initial expand state            |
| disabled | boolean    | Prevents interaction            |

---

## 14. DataGrid

Advanced data grid with extended capabilities.

### Props

| Prop         | Type      | Default | Description                         |
| ------------ | --------- | ------- | ----------------------------------- |
| columns      | Column[]  | —       | Column definitions                  |
| data         | object[]  | —       | Row data                            |
| sortable     | boolean   | true    | Enable column sorting               |
| filterable   | boolean   | true    | Enable column filtering             |
| paginated    | boolean   | true    | Enable pagination                   |
| selectable   | boolean   | false   | Enable row selection                |
| resizable    | boolean   | false   | Enable column resize                |
| reorderable  | boolean   | false   | Enable column reorder               |
| pinnable     | boolean   | false   | Enable column pinning               |
| virtualScroll| boolean   | false   | Enable virtual scrolling (large datasets) |
| bulkActions  | Action[]  | —       | Actions for selected rows           |
| density      | string    | "standard" | "compact" \| "standard" \| "comfortable" |

### Bulk Actions

Displayed in a toolbar when rows are selected.

- Select all / deselect all
- Apply bulk action (delete, export, etc.)
- Clear selection

---

## 15. Timeline

### Props

| Prop     | Type       | Default   | Description                        |
| -------- | ---------- | --------- | ---------------------------------- |
| items    | TimelineItem[] | —     | Timeline entries                   |
| variant  | string     | "default" | "default" \| "compact"             |

### TimelineItem Structure

| Property  | Type       | Description                     |
| --------- | ---------- | ------------------------------- |
| id        | string     | Unique entry identifier         |
| title     | string     | Event title                     |
| description | string  | Optional event description      |
| timestamp | string     | Formatted timestamp             |
| icon      | ReactNode  | Custom icon (default: circle)   |
| color     | string     | Override default color          |

### Layout

- Vertical layout with connecting line.
- Icons positioned on the left.
- Timestamps right-aligned.

---

## 16. StatusIndicator

### Props

| Prop   | Type    | Default | Description                         |
| ------ | ------- | ------- | ----------------------------------- |
| status | string  | —       | "active" \| "warning" \| "error" \| "inactive" |
| label  | string  | —       | Status text label                   |
| pulse  | boolean | false   | Animated pulse effect on the dot    |
| size   | string  | "md"    | "sm" \| "md" \| "lg"               |

### Status Colors

| Status   | Color    |
| -------- | -------- |
| active   | green-500|
| warning  | yellow-500|
| error    | red-500  |
| inactive | gray-400 |

### Behavior

- Pulse animation on active status (optional).
- Tooltip on hover showing full status details.
