/**
 * The sidebar merge is easy to get silently wrong: the server navigation and
 * the static catalogue both define an item with the same `id`, and React drops
 * one of two siblings sharing a key. These tests pin the merged result so a
 * nav addition cannot vanish without a failure.
 */
import { describe, it, expect } from 'vitest';
import { mergeNavItems } from './Shell';
import { filterByPermissions } from '../../utils/filterByPermissions';
import type { MetadataNavItem } from '../../types/metadata';

const server: MetadataNavItem[] = [
  { id: 'reports', label: 'Reports', path: '/reports', children: [
    { id: 'server-op', label: 'Operational Pack', path: '/reports/suite/operational' },
    { id: 'templates', label: 'Templates', path: '/reports/templates' },
  ]},
  { id: 'administration', label: 'Administration', path: '/administration' },
];

const staticItems: MetadataNavItem[] = [
  { id: 'reports', label: 'Reports', path: '/reports', children: [
    { id: 'static-op', label: 'Operational Pack', path: '/reports/suite/operational' },
  ]},
  { id: 'administration', label: 'Administration', path: '/administration' },
  { id: 'about', label: 'About MAP', path: '/about' },
  // mirrors the real STATIC_NAV_ITEMS entry: top level, permission-gated
  { id: 'report-studio', label: 'Report Studio', path: '/reports/studio', requiredPermissions: ['reports:read'] },
];

describe('mergeNavItems', () => {
  it('never emits two items with the same id', () => {
    const merged = mergeNavItems(server, staticItems);
    const ids = merged.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps server-only children', () => {
    const merged = mergeNavItems(server, staticItems);
    const reports = merged.find((i) => i.id === 'reports')!;
    const childIds = reports.children!.map((c) => c.id);
    expect(childIds).toContain('templates');
  });

  it('keeps static-only children', () => {
    const merged = mergeNavItems(server, staticItems);
    const reports = merged.find((i) => i.id === 'reports')!;
    expect(reports.children!.length).toBeGreaterThan(0);
  });

  it('de-duplicates children that point at the same page, even with different ids', () => {
    // The two catalogues name the same page with different ids
    // (`operational-reports` vs `operational-pack`). Merging on id alone would
    // render the link twice, so the merge also keys on path.
    const merged = mergeNavItems(server, staticItems);
    const reports = merged.find((i) => i.id === 'reports')!;
    const ops = reports.children!.filter((c) => c.path === '/reports/suite/operational');
    expect(ops).toHaveLength(1);
    expect(ops[0].id).toBe('server-op');
  });

  it('keeps static-only top-level items', () => {
    const merged = mergeNavItems(server, staticItems);
    expect(merged.find((i) => i.id === 'about')).toBeTruthy();
  });

  it('survives items with no children on either side', () => {
    const merged = mergeNavItems(
      [{ id: 'x', label: 'X', path: '/x' }],
      [{ id: 'x', label: 'X', path: '/x' }],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].children).toEqual([]);
  });
});

describe('Report Studio nav gate uses the canonical permission', () => {
  // Report Studio is a top-level STATIC item, because the server catalogue owns
  // the `reports` group and DEFAULT_NAV is only the pre-fetch fallback.
  const withStudio = filterByPermissions(
    mergeNavItems(server, staticItems),
    ['Super Admin'],
    ['reports:read', 'reports:create'],
  );
  const studio = () => withStudio.find((i) => i.id === 'report-studio');

  it('is shown to a principal holding reports:read', () => {
    expect(studio()).toBeTruthy();
    expect(studio()!.path).toBe('/reports/studio');
  });

  it('is hidden from a principal without reports:read', () => {
    const filtered = filterByPermissions(
      mergeNavItems(server, staticItems), ['Viewer'], ['validation:read'],
    );
    expect(filtered.find((i) => i.id === 'report-studio')).toBeUndefined();
  });

  it('survives the merge as a top-level entry, not only inside a group', () => {
    const merged = mergeNavItems(server, staticItems);
    expect(merged.find((i) => i.id === 'report-studio')).toBeTruthy();
  });
});
