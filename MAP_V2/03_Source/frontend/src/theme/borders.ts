import { colours } from './colours';

export const borders = {
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    none: 'none',
  },
  colour: {
    light: colours.border.light,
    default: colours.border.default,
    strong: colours.border.strong,
    focus: colours.border.focus,
    primary: colours.primary[500],
    success: colours.success[500],
    warning: colours.warning[500],
    error: colours.error[500],
    information: colours.information[500],
  },
} as const;

export const borderByComponent = {
  input: {
    default: `1px solid ${colours.border.light}`,
    hover: `1px solid ${colours.border.default}`,
    focus: `2px solid ${colours.border.focus}`,
    error: `2px solid ${colours.error[500]}`,
  },
  button: {
    default: `1px solid ${colours.border.light}`,
    primary: 'none',
    secondary: `1px solid ${colours.primary[500]}`,
  },
  card: {
    default: `1px solid ${colours.border.light}`,
    hover: `1px solid ${colours.border.default}`,
    selected: `2px solid ${colours.primary[500]}`,
  },
  table: {
    header: `1px solid ${colours.border.light}`,
    row: `1px solid ${colours.border.light}`,
    hover: `1px solid ${colours.border.default}`,
  },
  divider: `1px solid ${colours.border.light}`,
} as const;

export type Borders = typeof borders;
export type BorderByComponent = typeof borderByComponent;
