# MAP UI Component Guide

**Document:** UI Component Library
**Version:** 1.0
**Date:** June 2026

---

## 1. Buttons

### Primary Button

```css
.btn-primary {
  background: #667EEA;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 150ms ease;
}
.btn-primary:hover { background: #5A6FD6; }
.btn-primary:disabled { background: #E5E7EB; color: #9CA3AF; }
```

### Secondary Button

```css
.btn-secondary {
  background: #FFFFFF;
  color: #667EEA;
  border: 1px solid #667EEA;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
}
.btn-secondary:hover { background: #F3F4F6; }
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #667EEA;
  border: none;
}
.btn-ghost:hover { background: #F3F4F6; }
```

### Danger Button

```css
.btn-danger {
  background: #EF4444;
  color: #FFFFFF;
  border: none;
}
.btn-danger:hover { background: #DC2626; }
```

---

## 2. Inputs

```css
.input {
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 14px;
  width: 100%;
}
.input:focus { border-color: #667EEA; outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.input:error { border-color: #EF4444; }
.input:disabled { background: #F9FAFB; border-color: #E5E7EB; }
```

---

## 3. Cards

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.card:hover { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
```

---

## 4. Tables

```css
.table { width: 100%; border-collapse: collapse; }
.table th { background: #F9FAFB; font-weight: 600; text-align: left; padding: 12px 16px; border-bottom: 1px solid #E5E7EB; }
.table td { padding: 12px 16px; border-bottom: 1px solid #E5E7EB; }
.table tr:hover { background: #F9FAFB; }
```

---

## 5. Alerts

| Type | Background | Border | Icon |
|------|------------|--------|------|
| Success | #ECFDF5 | #10B981 | ✓ |
| Warning | #FFFBEB | #F59E0B | ⚠ |
| Error | #FEF2F2 | #EF4444 | ✕ |
| Info | #EFF6FF | #3B82F6 | ℹ |

---

## 6. Badges

```css
.badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
.badge-success { background: #ECFDF5; color: #10B981; }
.badge-warning { background: #FFFBEB; color: #F59E0B; }
.badge-error { background: #FEF2F2; color: #EF4444; }
.badge-info { background: #EFF6FF; color: #3B82F6; }
```

---

## 7. Navigation

```css
.nav { height: 64px; background: #FFFFFF; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; padding: 0 24px; }
.nav-link { color: #6B7280; padding: 8px 12px; border-radius: 6px; }
.nav-link:hover { color: #667EEA; background: #F3F4F6; }
.nav-link.active { color: #667EEA; border-bottom: 2px solid #667EEA; }
```

---

## 8. Modals

```css
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; }
.modal { background: #FFFFFF; border-radius: 12px; padding: 24px; max-width: 480px; width: 90%; }
.modal-header { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
```

---

## 9. Loading States

```css
.spinner { width: 24px; height: 24px; border: 3px solid #E5E7EB; border-top-color: #667EEA; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

---

*End of UI Component Guide*
