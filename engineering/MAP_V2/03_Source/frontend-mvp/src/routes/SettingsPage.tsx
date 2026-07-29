import { useState } from 'react';
import { useSettingList, useUpdateSetting } from '../hooks/useSettings';
import { useFeatureFlagList, useUpdateFeatureFlag } from '../hooks/useFeatureFlags';
import { useAuth } from '../context/AuthContext';
import {
  ErrorState,
  LoadingSkeleton,
  TabBar,
  EmptyState,
  StatusBadge,
} from '../components/shared';

type Tab = 'settings' | 'feature-flags';

const tabs = [
  { key: 'settings', label: 'System Settings' },
  { key: 'feature-flags', label: 'Feature Flags' },
];

export function SettingsPage() {
  const { userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: allSettings, loading, error } = useSettingList();
  const { data: featureFlags, loading: flagsLoading, error: flagsError, refetch: refetchFlags } = useFeatureFlagList();
  const { update: updateSetting, loading: updatingSetting } = useUpdateSetting();
  const { update: updateFlag, loading: updatingFlag } = useUpdateFeatureFlag();

  const categories = [...new Set(allSettings.map(s => s.category))];
  const categorySettings = selectedCategory
    ? allSettings.filter(s => s.category === selectedCategory)
    : allSettings;

  const handleUpdateSetting = async (category: string, key: string, value: unknown) => {
    await updateSetting(category, key, { value });
  };

  const handleToggleFlag = async (key: string, enabled: boolean) => {
    await updateFlag(key, { enabled });
    refetchFlags();
  };

  const handleUpdateRollout = async (key: string, rollout_percentage: number) => {
    await updateFlag(key, { rollout_percentage });
    refetchFlags();
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-md)' }}>Settings</h1>
        <ErrorState
          title="Access Denied"
          message="You do not have permission to view this page. Required role: admin"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-lg)' }}>Settings</h1>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as Tab)}
      />

      {activeTab === 'settings' && (
        <>
          {loading && <LoadingSkeleton variant="list" rows={5} />}
          {error && <ErrorState message={error} />}

          {!loading && !error && (
            <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
              <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setSelectedCategory('')}
                    aria-label="Filter by category"
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm) var(--space-md)',
                      background: !selectedCategory ? 'var(--color-sidebar-active)' : 'var(--color-background)',
                      color: !selectedCategory ? 'white' : 'var(--color-text)',
                      border: 'none',
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-base)',
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-label={`Filter by category: ${cat}`}
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm) var(--space-md)',
                        background: selectedCategory === cat ? 'var(--color-sidebar-active)' : 'var(--color-background)',
                        color: selectedCategory === cat ? 'white' : 'var(--color-text)',
                        border: 'none',
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 'var(--font-size-base)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                {categorySettings.length === 0 ? (
                  <EmptyState
                    title="No settings found"
                    description={selectedCategory ? 'No settings in this category' : 'No settings configured'}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {categorySettings.map((setting) => (
                      <SettingRow
                        key={`${setting.category}-${setting.key}`}
                        setting={setting}
                        onUpdate={handleUpdateSetting}
                        updating={updatingSetting}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'feature-flags' && (
        <>
          {flagsLoading && <LoadingSkeleton variant="list" rows={4} />}
          {flagsError && <ErrorState message={flagsError} />}

          {!flagsLoading && !flagsError && (
            <>
              {featureFlags.length === 0 ? (
                <EmptyState
                  title="No feature flags found"
                  description="No feature flags configured"
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {featureFlags.map((flag) => (
                    <FlagRow
                      key={flag.key}
                      flag={flag}
                      onToggle={handleToggleFlag}
                      onUpdateRollout={handleUpdateRollout}
                      updating={updatingFlag}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function SettingRow({ setting, onUpdate, updating }: {
  setting: { category: string; key: string; value: unknown; description: string | null; data_type: string; is_readonly: boolean };
  onUpdate: (category: string, key: string, value: unknown) => Promise<void>;
  updating: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(setting.value ?? ''));

  const handleSave = async () => {
    let parsedValue: unknown = editValue;
    if (setting.data_type === 'boolean') {
      parsedValue = editValue === 'true';
    } else if (setting.data_type === 'number') {
      parsedValue = Number(editValue);
    } else if (setting.data_type === 'json') {
      try {
        parsedValue = JSON.parse(editValue);
      } catch {
        return;
      }
    }
    await onUpdate(setting.category, setting.key, parsedValue);
    setEditing(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-md)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{setting.key}</div>
        {setting.description && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
            {setting.description}
          </div>
        )}
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
          Type: {setting.data_type} {setting.is_readonly && '(read-only)'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {editing ? (
          <>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: 200,
                padding: 'var(--space-xs) var(--space-sm)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-base)',
              }}
            />
            <button
              onClick={handleSave}
              disabled={updating}
              aria-label={`Save ${setting.key}`}
              style={{
                padding: 'var(--space-xs) var(--space-sm)',
                background: 'var(--color-sidebar-active)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              aria-label={`Cancel editing ${setting.key}`}
              style={{
                padding: 'var(--space-xs) var(--space-sm)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 'var(--font-size-base)', minWidth: 100, textAlign: 'right' }}>
              {String(setting.value ?? '—')}
            </span>
            {!setting.is_readonly && (
              <button
                onClick={() => { setEditValue(String(setting.value ?? '')); setEditing(true); }}
                aria-label={`Edit ${setting.key}`}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FlagRow({ flag, onToggle, onUpdateRollout, updating }: {
  flag: { key: string; name: string; description: string | null; enabled: boolean; rollout_percentage: number; status: string };
  onToggle: (key: string, enabled: boolean) => Promise<void>;
  onUpdateRollout: (key: string, rollout: number) => Promise<void>;
  updating: boolean;
}) {
  const [editingRollout, setEditingRollout] = useState(false);
  const [rolloutValue, setRolloutValue] = useState(String(flag.rollout_percentage));

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-md)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{flag.name}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
          Key: {flag.key}
        </div>
        {flag.description && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
            {flag.description}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Rollout:</span>
          {editingRollout ? (
            <>
              <input
                type="number"
                min={0}
                max={100}
                value={rolloutValue}
                onChange={(e) => setRolloutValue(e.target.value)}
                style={{
                  width: 60,
                  padding: 'var(--space-xs) var(--space-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-xs)',
                }}
              />
              <button
                onClick={async () => {
                  await onUpdateRollout(flag.key, Number(rolloutValue));
                  setEditingRollout(false);
                }}
                disabled={updating}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  background: 'var(--color-sidebar-active)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditingRollout(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-sidebar-active)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-xs)',
                padding: 0,
              }}
            >
              {flag.rollout_percentage}%
            </button>
          )}
        </div>

        <button
          onClick={() => onToggle(flag.key, !flag.enabled)}
          disabled={updating}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: updating ? 'not-allowed' : 'pointer',
          }}
        >
          <StatusBadge
            status={flag.enabled ? 'Enabled' : 'Disabled'}
            variant={flag.enabled ? 'success' : 'danger'}
            size="sm"
          />
        </button>
      </div>
    </div>
  );
}
