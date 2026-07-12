import { typography } from '../typography';

export const tableStyles = {
  base: 'w-full text-sm text-left',
  container: `
    overflow-x-auto
    border border-neutral-30
    rounded-lg
  `,
  header: {
    base: `
      bg-neutral-20
      text-neutral-100
      ${typography.table.header.fontSize}
      ${typography.table.header.fontWeight}
      ${typography.table.header.letterSpacing}
    `,
    cell: 'px-4 py-3 whitespace-nowrap',
    sortable: 'cursor-pointer hover:bg-neutral-30 select-none',
  },
  body: {
    base: `
      bg-white
      text-neutral-100
      ${typography.table.body.fontSize}
      ${typography.table.body.fontWeight}
    `,
    row: {
      base: 'border-b border-neutral-30 last:border-b-0',
      hover: 'hover:bg-neutral-10',
      selected: 'bg-primary-50',
      striped: 'even:bg-neutral-10',
    },
    cell: 'px-4 py-3 whitespace-nowrap',
  },
  footer: {
    base: 'bg-neutral-20 text-neutral-100',
    cell: 'px-4 py-3',
  },
  empty: {
    base: 'px-4 py-8 text-center text-neutral-60',
  },
  actions: {
    base: 'flex items-center gap-2',
    cell: 'px-4 py-3 text-right',
  },
};

export const getTableClasses = () => {
  return tableStyles.base;
};

export const getTableHeaderClasses = () => {
  return tableStyles.header.base;
};

export const getTableRowClasses = (
  isHovered = false,
  isSelected = false,
  isStriped = false
) => {
  let classes = tableStyles.body.row.base;
  if (isHovered) classes += ' ' + tableStyles.body.row.hover;
  if (isSelected) classes += ' ' + tableStyles.body.row.selected;
  if (isStriped) classes += ' ' + tableStyles.body.row.striped;
  return classes.trim();
};
