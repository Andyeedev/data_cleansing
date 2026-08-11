import { useState, useRef, useCallback, useEffect } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
}

const DIVIDER_WIDTH = 4;

export function SplitPane({
  left,
  right,
  defaultLeftWidth = 30,
  minWidth = 200,
  maxWidth = 50,
  storageKey = 'splitpane-width',
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 10 && parsed <= maxWidth) return parsed;
      }
    } catch {}
    return defaultLeftWidth;
  });
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    startX.current = e.clientX;
    startWidth.current = leftWidth;
  }, [leftWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const dx = e.clientX - startX.current;
    const newWidthPx = (startWidth.current / 100) * containerWidth + dx;
    const newWidthPct = (newWidthPx / containerWidth) * 100;
    const clamped = Math.max(minWidth / containerWidth * 100, Math.min(maxWidth, newWidthPct));
    setLeftWidth(clamped);
  }, [dragging, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      setDragging(false);
      try {
        localStorage.setItem(storageKey, String(leftWidth));
      } catch {}
    }
  }, [dragging, leftWidth, storageKey]);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-md)' }}>
        <div style={{ flex: '0 0 auto', maxHeight: '40vh', overflow: 'auto' }}>{left}</div>
        <div style={{ flex: 1, overflow: 'auto' }}>{right}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        height: '100%',
        minHeight: 0,
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: `0 0 calc(${leftWidth}% - ${DIVIDER_WIDTH / 2}px)`,
          overflow: 'auto',
          minWidth: 0,
        }}
      >
        {left}
      </div>
      <div
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(leftWidth)}
        aria-label="Resize panels"
        tabIndex={0}
        onKeyDown={(e) => {
          const step = 2;
          if (e.key === 'ArrowLeft') setLeftWidth((w) => Math.max(minWidth / (containerRef.current?.offsetWidth || 1) * 100, w - step));
          if (e.key === 'ArrowRight') setLeftWidth((w) => Math.min(maxWidth, w + step));
        }}
        style={{
          width: DIVIDER_WIDTH,
          flexShrink: 0,
          background: dragging ? 'var(--color-primary)' : 'var(--color-border)',
          cursor: 'col-resize',
          transition: dragging ? 'none' : 'background 0.15s',
          borderRadius: 'var(--radius)',
        }}
      />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          minWidth: 0,
        }}
      >
        {right}
      </div>
    </div>
  );
}
