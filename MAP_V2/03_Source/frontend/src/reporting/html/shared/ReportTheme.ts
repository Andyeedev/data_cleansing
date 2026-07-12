export const reportTheme = {
  print: {
    pageBreakBefore: 'break-before: page',
    pageBreakAfter: 'break-after: page',
    pageBreakInside: 'break-inside: avoid',
    noBreak: 'break-inside: avoid',
  },
  layout: {
    maxWidth: '1200px',
    contentPadding: '2rem',
    sectionGap: '2rem',
    headerHeight: '80px',
    footerHeight: '60px',
  },
  typography: {
    coverTitle: 'text-4xl font-bold text-neutral-100',
    coverSubtitle: 'text-xl text-neutral-70',
    sectionTitle: 'text-2xl font-semibold text-neutral-100',
    subsectionTitle: 'text-lg font-medium text-neutral-80',
    body: 'text-base text-neutral-90 leading-relaxed',
    caption: 'text-sm text-neutral-60',
    footer: 'text-xs text-neutral-50',
  },
  colours: {
    coverBg: 'bg-gradient-to-br from-primary-600 to-primary-800',
    sectionBorder: 'border-l-4 border-primary-500',
    summaryBg: 'bg-primary-50',
    riskCritical: 'bg-error-50 border-error-500',
    riskHigh: 'bg-warning-50 border-warning-500',
    riskMedium: 'bg-information-50 border-information-500',
    riskLow: 'bg-success-50 border-success-500',
    tableHeader: 'bg-neutral-10 text-neutral-100',
    tableRow: 'border-b border-neutral-20',
    tableRowHover: 'hover:bg-neutral-10',
  },
  spacing: {
    sectionPadding: 'p-6',
    componentGap: 'gap-4',
    marginTop: 'mt-4',
    marginBottom: 'mb-4',
  },
  borders: {
    section: 'border border-neutral-30 rounded-lg',
    card: 'border border-neutral-20 rounded-md',
    divider: 'border-t border-neutral-20',
  },
};

export type ReportTheme = typeof reportTheme;
