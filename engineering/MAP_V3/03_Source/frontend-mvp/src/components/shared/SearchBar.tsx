import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounce?: number;
}

export function SearchBar({ value, onChange, onSearch, placeholder = 'Search...', debounce = 300 }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange(newValue);
      onSearch?.(newValue);
    }, debounce);
  }, [onChange, onSearch, debounce]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      onChange(localValue);
      onSearch?.(localValue);
    }
  }, [localValue, onChange, onSearch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: '100%',
          padding: 'var(--space-sm) var(--space-md)',
          paddingLeft: 'var(--space-lg)',
          border: 'var(--border-width) solid var(--color-border)',
          borderRadius: 'var(--radius)',
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          fontSize: 'var(--font-size-base)',
          outline: 'none',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 'var(--space-sm)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--icon-sm)',
          pointerEvents: 'none',
        }}
      >
        🔍
      </span>
    </div>
  );
}
