export * from './colours';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './borders';
export * from './shadows';
export * from './icons';
export * from './animations';
export * from './breakpoints';
export * from './zindex';
export * from './components';
export * from './dashboard';

import { colours, darkModeColours } from './colours';
import { typography } from './typography';
import { spacing, grid, layout } from './spacing';
import { radius, radiusByComponent } from './radius';
import { borders, borderByComponent } from './borders';
import { shadows, shadowByComponent } from './shadows';
import { icons, iconSizes } from './icons';
import { animations } from './animations';
import { breakpoints, mediaQueries, responsive } from './breakpoints';
import { zIndex, zIndexByComponent } from './zindex';

export const theme = {
  colours,
  darkModeColours,
  typography,
  spacing,
  grid,
  layout,
  radius,
  radiusByComponent,
  borders,
  borderByComponent,
  shadows,
  shadowByComponent,
  icons,
  iconSizes,
  animations,
  breakpoints,
  mediaQueries,
  responsive,
  zIndex,
  zIndexByComponent,
} as const;

export type Theme = typeof theme;
