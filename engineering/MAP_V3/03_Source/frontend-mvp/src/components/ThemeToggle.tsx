import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Palette, Eye } from 'lucide-react';

type ThemeOption = 'light' | 'dark' | 'blue' | 'high-contrast';

const themes: { key: ThemeOption; label: string; icon: typeof Sun }[] = [
  { key: 'light',         label: 'Light',         icon: Sun },
  { key: 'dark',          label: 'Dark',          icon: Moon },
  { key: 'blue',          label: 'Blue',          icon: Palette },
  { key: 'high-contrast', label: 'High Contrast', icon: Eye },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>(() => {
    return (localStorage.getItem('map-theme') as ThemeOption) || 'light';
  });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('map-theme', theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = themes.find((t) => t.key === theme) || themes[0];
  const Icon = current.icon;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle theme"
        title={`Theme: ${current.label}`}
        style={{
          background: 'none',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '6px 10px',
          cursor: 'pointer',
          color: 'var(--color-text)',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Icon size={16} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: 6,
          width: 180,
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          zIndex: 50,
          overflow: 'hidden',
          padding: '4px 0',
        }}>
          {themes.map((t) => {
            const TIcon = t.icon;
            const isActive = t.key === theme;
            return (
              <button
                key={t.key}
                onClick={() => { setTheme(t.key); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: 10,
                  padding: '8px 14px',
                  background: isActive ? 'var(--color-bg-secondary)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'none'; }}
              >
                <TIcon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
