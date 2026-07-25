import { useState } from 'react';
import { useSettingList, useUpdateSetting } from '../hooks/useSettings';
import { useFeatureFlagList, useUpdateFeatureFlag } from '../hooks/useFeatureFlags';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

type Tab = 'settings' | 'feature-flags';

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
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Settings</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Settings</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 4 }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '8px 16px',
            background: activeTab === 'settings' ? 'var(--color-sidebar-active)' : 'transparent',
            color: activeTab === 'settings' ? 'white' : 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius) var(--radius) 0 0',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: activeTab === 'settings' ? 600 : 400,
          }}
        >
          System Settings
        </button>
        <button
          onClick={() => setActiveTab('feature-flags')}
          style={{
            padding: '8px 16px',
            background: activeTab === 'feature-flags' ? 'var(--color-sidebar-active)' : 'transparent',
            color: activeTab === 'feature-flags' ? 'white' : 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius) var(--radius) 0 0',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: activeTab === 'feature-flags' ? 600 : 400,
          }}
        >
          Feature Flags
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <>
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Category Sidebar */}
              <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setSelectedCategory('')}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: !selectedCategory ? 'var(--color-sidebar-active)' : 'var(--color-background)',
                      color: !selectedCategory ? 'white' : 'var(--color-text)',
                      border: 'none',
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 14,
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: selectedCategory === cat ? 'var(--color-sidebar-active)' : 'var(--color-background)',
                        color: selectedCategory === cat ? 'white' : 'var(--color-text)',
                        border: 'none',
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 14,
                        textTransform: 'capitalize',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings List */}
              <div style={{ flex: 1 }}>
                {categorySettings.length === 0 ? (
                  <div style={{
                    padding: 48,
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    border: '1px dashed var(--color-border)',
                    borderRadius: 'var(--radius)',
                  }}>
                    <p style={{ fontSize: 16, marginBottom: 8 }}>No settings found</p>
                    <p style={{ fontSize: 14 }}>
                      {selectedCategory ? 'No settings in this category' : 'No settings configured'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

      {/* Feature Flags Tab */}
      {activeTab === 'feature-flags' && (
        <>
          {flagsLoading && <LoadingSpinner />}
          {flagsError && <ErrorMessage message={flagsError} />}

          {!flagsLoading && !flagsError && (
            <>
              {featureFlags.length === 0 ? (
                <div style={{
                  padding: 48,
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}>
                  <p style={{ fontSize: 16, marginBottom: 8 }}>No feature flags found</p>
                  <p style={{ fontSize: 14 }}>No feature flags configured</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
      padding: '16px',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{setting.key}</div>
        {setting.description && (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {setting.description}
          </div>
        )}
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Type: {setting.data_type} {setting.is_readonly && '(read-only)'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {editing ? (
          <>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: 200,
                padding: '6px 10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSave}
              disabled={updating}
              style={{
                padding: '6px 12px',
                background: 'var(--color-sidebar-active)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 14, minWidth: 100, textAlign: 'right' }}>
              {String(setting.value ?? '—')}
            </span>
            {!setting.is_readonly && (
              <button
                onClick={() => { setEditValue(String(setting.value ?? '')); setEditing(true); }}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 12,
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
      padding: '16px',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{flag.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Key: {flag.key}
        </div>
        {flag.description && (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {flag.description}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Rollout Percentage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Rollout:</span>
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
                  padding: '4px 8px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 12,
                }}
              />
              <button
                onClick={async () => {
                  await onUpdateRollout(flag.key, Number(rolloutValue));
                  setEditingRollout(false);
                }}
                disabled={updating}
                style={{
                  padding: '4px 8px',
                  background: 'var(--color-sidebar-active)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 11,
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
                fontSize: 12,
                padding: 0,
              }}
            >
              {flag.rollout_percentage}%
            </button>
          )}
        </div>

        {/* Enabled Toggle */}
        <button
          onClick={() => onToggle(flag.key, !flag.enabled)}
          disabled={updating}
          style={{
            padding: '6px 12px',
            background: flag.enabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: flag.enabled ? '#22c55e' : '#ef4444',
            border: `1px solid ${flag.enabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {flag.enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
}
