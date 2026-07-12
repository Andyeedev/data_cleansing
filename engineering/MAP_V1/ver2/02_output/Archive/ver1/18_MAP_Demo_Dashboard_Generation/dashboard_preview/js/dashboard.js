// MAP Nexus Dashboard — Navigation + Chart.js Rendering
// Module 02 — UI Refinement Applied

(function() {
  'use strict';

  const D = MAP_DATA;
  const charts = {};

  // ── SVG Icons ──
  const icons = {
    'home': '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'gauge': '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg>',
    'layers': '<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'shield': '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'alert-circle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'alert-octagon': '<svg viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'database': '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    'check': '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    'x-circle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    'server': '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    'clock': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'trending-up': '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'pie-chart': '<svg viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'target': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'repeat': '<svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    'hash': '<svg viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
    'link': '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    'award': '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    'shield-off': '<svg viewBox="0 0 24 24"><path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"/><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    'zap': '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'bell': '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    'play': '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    'bar-chart': '<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    'activity': '<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'info': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  function icon(name) {
    return icons[name] || icons['info'];
  }

  function statusClass(s) {
    if (!s) return 'info';
    s = s.toLowerCase();
    if (s === 'pass' || s === 'passed' || s === 'success' || s === 'online' || s === 'running' || s === 'completed') return 'success';
    if (s === 'fail' || s === 'failed' || s === 'error' || s === 'blocked' || s === 'critical' || s === 'nogo' || s === 'no-go' || s === 'attention required' || s === 'critical issue') return 'error';
    if (s === 'warning' || s === 'high' || s === 'medium' || s === 'in_progress') return 'warning';
    if (s === 'disabled' || s === 'not_started' || s === 'mixed') return 'info';
    return 'info';
  }

  function statusLabel(s) {
    if (!s) return 'INFO';
    return s.replace(/_/g, ' ');
  }

  // ── Navigation ──
  function navigate(viewId) {
    document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const view = document.getElementById('view-' + viewId);
    if (view) view.classList.add('active');

    const nav = document.querySelector(`[data-view="${viewId}"]`);
    if (nav) nav.classList.add('active');

    const title = document.getElementById('page-title');
    const titles = {
      'home': 'Home',
      'executive': 'Executive Dashboard',
      'migration': 'Migration Overview',
      'validation': 'Validation Centre',
      'risk': 'Risk Assessment',
      'quality': 'Data Quality',
      'governance': 'Governance Centre',
      'progress': 'Migration Progress'
    };
    if (title) title.textContent = titles[viewId] || 'Dashboard';

    // Render charts on first view
    if (viewId === 'executive') renderExecutiveCharts();
    if (viewId === 'validation') renderValidationCharts();
    if (viewId === 'quality') renderQualityCharts();
    if (viewId === 'governance') renderGovernanceCharts();
  }

  // ── KPI Card Builder ──
  function buildKpiCards(containerId, cards) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = cards.map(c => `
      <div class="kpi-card ${statusClass(c.status)}">
        <div class="kpi-label">${c.label}</div>
        <div class="kpi-value">${c.value}</div>
      </div>
    `).join('');
  }

  // ── Donut Chart ──
  function renderDonut(canvasId, data, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { family: 'Segoe UI', size: 12 } } },
          title: { display: !!title, text: title, font: { family: 'Segoe UI', size: 14, weight: '600' }, padding: { bottom: 12 } }
        }
      }
    });
  }

  // ── Bar Chart ──
  function renderBar(canvasId, data, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderRadius: 6,
          maxBarThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: !!title, text: title, font: { family: 'Segoe UI', size: 14, weight: '600' }, padding: { bottom: 12 } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { font: { family: 'Segoe UI', size: 12 } }, grid: { color: '#F0F0F0' } },
          x: { ticks: { font: { family: 'Segoe UI', size: 12 } }, grid: { display: false } }
        }
      }
    });
  }

  // ── Radar Chart ──
  function renderRadar(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.map(d => d.dimension),
        datasets: [{
          data: data.map(d => d.score),
          backgroundColor: 'rgba(0, 120, 212, 0.15)',
          borderColor: '#0078D4',
          borderWidth: 2,
          pointBackgroundColor: '#0078D4',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, font: { family: 'Segoe UI', size: 10 }, backdropColor: 'transparent' },
            pointLabels: { font: { family: 'Segoe UI', size: 12 } },
            grid: { color: '#E0E0E0' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // ── Line Chart ──
  function renderLine(canvasId, labels, data, label, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: color || '#0078D4',
          backgroundColor: (color || '#0078D4') + '20',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: color || '#0078D4'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: false, ticks: { font: { family: 'Segoe UI', size: 12 } }, grid: { color: '#F0F0F0' } },
          x: { ticks: { font: { family: 'Segoe UI', size: 12 } }, grid: { display: false } }
        }
      }
    });
  }

  // ── Dashboard Renderers ──

  function renderExecutiveCharts() {
    const d = D.executiveOverview;
    renderDonut('chart-issue-dist', d.charts.issue_distribution.data, 'Findings Distribution');
    renderBar('chart-control-status', d.charts.control_status.data, 'Control Results');
  }

  function renderValidationCharts() {
    const d = D.validationResults;
    renderDonut('chart-val-dist', d.validation_distribution.data, 'Validation Distribution');
  }

  function renderQualityCharts() {
    const d = D.dataQuality;
    renderRadar('chart-quality-radar', d.quality_chart.data);
    renderLine('chart-quality-trend',
      d.quality_trend.data.map(t => t.date),
      d.quality_trend.data.map(t => t.score),
      'Quality Score', '#0078D4');
  }

  function renderGovernanceCharts() {
    const d = D.governanceCentre;
    renderBar('chart-issue-by-type', d.issue_summary_chart.data.map(i => ({ label: i.type, value: i.count, color: i.severity === 'CRITICAL' ? '#C62828' : i.severity === 'HIGH' ? '#F9A825' : '#FF9800' })), 'Findings by Type');
    renderDonut('chart-severity-dist', d.severity_distribution.data, 'Severity Distribution');
  }

  // ── Init ──
  function init() {
    // Navigation click handlers
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        navigate(this.dataset.view);
      });
    });

    // Landing tile click handlers
    document.querySelectorAll('.landing-tile[data-view]').forEach(tile => {
      tile.addEventListener('click', function() {
        navigate(this.dataset.view);
      });
    });

    // Build all KPI card grids
    buildKpiCards('kpi-executive', D.executiveOverview.kpi_cards);
    buildKpiCards('kpi-migration', D.migrationOverview.kpi_cards);
    buildKpiCards('kpi-risk', D.riskDashboard.kpi_cards);
    buildKpiCards('kpi-progress', D.migrationProgress.kpi_cards);
    buildKpiCards('kpi-quality', D.dataQuality.kpi_cards);
    buildKpiCards('kpi-governance', D.governanceCentre.kpi_cards);

    // Render tables and components
    renderMigrationTable();
    renderValidationTable();
    renderRiskMatrix();
    renderGoNoGo();
    renderProgressBars();
    renderQualityDimensions();
    renderGovernanceTable();
    renderSystemHealth();

    // Start on home
    navigate('home');
  }

  function renderMigrationTable() {
    const el = document.getElementById('entity-table');
    if (!el) return;
    el.innerHTML = D.migrationOverview.entity_details.map(e => `
      <tr>
        <td>${e.source}</td>
        <td>${e.target}</td>
        <td>${e.source_rows}</td>
        <td>${e.target_rows}</td>
        <td><span class="status-dot ${e.row_match ? 'pass' : 'fail'}">${e.row_match ? 'Match' : 'Mismatch'}</span></td>
        <td><span class="status-dot ${e.status.toLowerCase().replace(/ /g, '-')}">${e.status}</span></td>
      </tr>
    `).join('');
  }

  function renderValidationTable() {
    const el = document.getElementById('validation-table');
    if (!el) return;
    el.innerHTML = D.validationResults.validation_summary.map(v => `
      <tr>
        <td>${v.validation}</td>
        <td><span class="status-dot ${v.status.toLowerCase().replace(/ /g, '-')}">${v.status}</span></td>
        <td><span class="severity-badge ${v.severity.toLowerCase()}">${v.severity}</span></td>
        <td>${v.details}</td>
      </tr>
    `).join('');
  }

  function renderRiskMatrix() {
    const el = document.getElementById('risk-matrix');
    if (!el) return;
    el.innerHTML = D.riskDashboard.risk_matrix.data.map(r => `
      <div class="risk-cell" style="background: ${r.color}20; border: 1px solid ${r.color}40;">
        <div class="risk-category" style="color: ${r.color};">${r.category}</div>
        <div class="risk-score" style="color: ${r.color};">${r.score}</div>
        <div style="font-size:10px; color:${r.color};">${r.risk}</div>
      </div>
    `).join('');
  }

  function renderGoNoGo() {
    const el = document.getElementById('go-nogo');
    if (!el) return;
    const g = D.riskDashboard.go_no_go;
    const isGo = g.decision === 'GO';
    el.innerHTML = `
      <div class="go-nogo-card ${isGo ? 'go' : 'nogo'}">
        <div class="decision">${g.decision}</div>
        <div class="reason">${g.reason}</div>
        <ul class="requirements">
          ${g.minimum_requirements.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function renderProgressBars() {
    const el = document.getElementById('progress-bars');
    if (!el) return;
    el.innerHTML = D.migrationProgress.phases.map(p => {
      const sc = p.status === 'COMPLETED' ? 'success' : p.status === 'IN_PROGRESS' ? 'primary' : 'info';
      return `
        <div class="progress-bar-container">
          <div class="progress-label">
            <span class="name">${p.phase}</span>
            <span class="pct">${p.completion_pct}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${sc}" style="width: ${p.completion_pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderQualityDimensions() {
    const el = document.getElementById('quality-dimensions');
    if (!el) return;
    el.innerHTML = D.dataQuality.quality_dimensions.map(d => `
      <div class="progress-bar-container">
        <div class="progress-label">
          <span class="name">${d.dimension}</span>
          <span class="pct">${d.score}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${d.score >= 80 ? 'success' : d.score >= 60 ? 'warning' : 'error'}" style="width: ${d.score}%"></div>
        </div>
        <div style="font-size:11px; color:#9E9E9E; margin-top:6px;">${d.details}</div>
      </div>
    `).join('');
  }

  function renderGovernanceTable() {
    const el = document.getElementById('governance-table');
    if (!el) return;
    el.innerHTML = D.governanceCentre.issues.map(i => `
      <tr>
        <td>${i.id}</td>
        <td>${i.type}</td>
        <td>${i.description}</td>
        <td><span class="severity-badge ${i.severity.toLowerCase()}">${i.severity}</span></td>
        <td>${i.owner}</td>
        <td><span class="status-badge error">${i.status}</span></td>
        <td>${i.resolution_pct}%</td>
      </tr>
    `).join('');
  }

  function renderSystemHealth() {
    const el = document.getElementById('system-health');
    if (!el) return;
    const h = D.migrationOverview.systems;
    el.innerHTML = `
      <div class="health-card">
        <div class="health-name">${h.source.name}</div>
        <div class="health-status online">${icon('check-circle')} Connected</div>
        <div class="health-meta">${h.source.type}<br>Entities: ${h.source.entities.length}</div>
      </div>
      <div class="health-card">
        <div class="health-name">${h.target.name}</div>
        <div class="health-status online">${icon('check-circle')} Connected</div>
        <div class="health-meta">${h.target.type}<br>Entities: ${h.target.entities.length}</div>
      </div>
      <div class="health-card">
        <div class="health-name">Migration Engine</div>
        <div class="health-status running">${icon('activity')} Active</div>
        <div class="health-meta">Version 1.4<br>Execution Time: ${D.migrationOverview.migration_scope.execution_duration_seconds}s</div>
      </div>
    `;
  }

  // ── Start ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
