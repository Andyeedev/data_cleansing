/* MAP Nexus Dashboard — Navigation & Chart Rendering (Module 02 Refined) */
/* Accessibility, Responsive, Keyboard Navigation */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Elements
  // ----------------------------------------------------------
  var views = document.querySelectorAll('.dashboard-view');
  var navItems = document.querySelectorAll('.nav-item[data-view]');
  var landingTiles = document.querySelectorAll('.landing-tile[data-view]');
  var pageTitle = document.getElementById('page-title');
  var sidebar = document.getElementById('sidebar');
  var mobileMenuBtn = document.getElementById('mobile-menu-btn');
  var topBarTimestamp = document.getElementById('top-bar-timestamp');

  var pageNames = {
    home: 'Home',
    executive: 'Executive Dashboard',
    migration: 'Migration Overview',
    validation: 'Validation Centre',
    risk: 'Risk Assessment',
    quality: 'Data Quality',
    governance: 'Governance Centre',
    progress: 'Migration Progress'
  };

  var charts = {};

  // ----------------------------------------------------------
  // Mobile Menu
  // ----------------------------------------------------------
  function closeMobileMenu() {
    if (sidebar) sidebar.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      var isOpen = sidebar.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.addEventListener('click', function (e) {
    if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ----------------------------------------------------------
  // Timestamp
  // ----------------------------------------------------------
  function renderTimestamp() {
    if (!topBarTimestamp || !window.MAP_DATA || !MAP_DATA.landing) return;
    var executed = MAP_DATA.landing.executed;
    if (executed) {
      try {
        var d = new Date(executed);
        var formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        topBarTimestamp.textContent = formatted;
      } catch (err) {
        topBarTimestamp.textContent = '';
      }
    }
  }

  // ----------------------------------------------------------
  // View Navigation
  // ----------------------------------------------------------
  function showView(id) {
    views.forEach(function (v) { v.classList.remove('active'); });
    var target = document.getElementById('view-' + id);
    if (target) target.classList.add('active');

    navItems.forEach(function (n) {
      n.classList.remove('active');
      n.removeAttribute('aria-current');
    });
    var navTarget = document.querySelector('.nav-item[data-view="' + id + '"]');
    if (navTarget) {
      navTarget.classList.add('active');
      navTarget.setAttribute('aria-current', 'page');
    }

    if (pageTitle) pageTitle.textContent = pageNames[id] || id;
    closeMobileMenu();
    renderCharts(id);
    window.location.hash = id;

    // Focus management
    if (target) {
      var heading = target.querySelector('.section-header h3, .landing-hero');
      if (heading) heading.setAttribute('tabindex', '-1');
    }
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      showView(this.dataset.view);
    });
  });

  landingTiles.forEach(function (item) {
    item.addEventListener('click', function () {
      showView(this.dataset.view);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showView(this.dataset.view);
      }
    });
  });

  // Hash navigation
  var hash = window.location.hash.replace('#', '');
  if (hash && pageNames[hash]) {
    showView(hash);
  } else {
    showView('home');
  }

  window.addEventListener('hashchange', function () {
    var h = window.location.hash.replace('#', '');
    if (h && pageNames[h]) showView(h);
  });

  // ----------------------------------------------------------
  // KPI Cards
  // ----------------------------------------------------------
  function makeKpiCards(containerId, data) {
    var el = document.getElementById(containerId);
    if (!el || !data) return;
    el.innerHTML = data.map(function (k) {
      return '<div class="kpi-card status-' + k.status + '" role="listitem">' +
        '<div class="kpi-label">' + k.label + '</div>' +
        '<div class="kpi-value">' + k.value + '</div>' +
        '</div>';
    }).join('');
  }

  // ----------------------------------------------------------
  // Status Badges
  // ----------------------------------------------------------
  function makeStatusBadge(status) {
    var cls = 'info';
    var s = String(status).toUpperCase();
    if (s === 'PASS' || s === 'PASSED') cls = 'success';
    else if (s === 'FAIL' || s === 'FAILED' || s === 'BLOCKED') cls = 'error';
    else if (s === 'ERROR') cls = 'error';
    else if (s === 'WARNING' || s === 'ATTENTION_REQUIRED') cls = 'warning';
    else if (s === 'CRITICAL') cls = 'error';
    else if (s === 'HIGH') cls = 'warning';
    else if (s === 'MEDIUM') cls = 'info';
    else if (s === 'LOW') cls = 'success';
    else if (s === 'OPEN') cls = 'error';
    else if (s === 'NOT_STARTED') cls = 'neutral';
    return '<span class="badge badge-' + cls + '">' + status + '</span>';
  }

  // ----------------------------------------------------------
  // Chart Defaults (Module 00)
  // ----------------------------------------------------------
  var chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { family: "'Segoe UI', Arial, sans-serif", size: 12 }
        }
      }
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    }
  };

  // ----------------------------------------------------------
  // Render Charts
  // ----------------------------------------------------------
  function renderCharts(viewId) {
    // Destroy existing charts
    Object.keys(charts).forEach(function (k) {
      if (charts[k]) { charts[k].destroy(); delete charts[k]; }
    });

    var D = MAP_DATA;
    if (!D) return;

    // HOME
    if (viewId === 'home') {
      var ld = D.landing;
      if (ld) {
        setText('landing-readiness', ld.readiness);
        setText('landing-score', ld.validationScore);
        setText('landing-failed', ld.failedRules);
        setText('landing-blocking', ld.blockingControls);
        var meta = document.getElementById('landing-meta');
        if (meta) meta.textContent = (ld.scenarioName || 'Customer Core Banking Migration') + ' \u00B7 ' + (ld.scenario || 'Scenario 3 \u2014 MIXTURE');
      }
    }

    // EXECUTIVE
    if (viewId === 'executive') {
      makeKpiCards('kpi-executive', D.executive.kpi);
      renderDonut('chart-issue-dist', D.executive.issueDist);
      renderBar('chart-control-status', D.executive.controlStatus);
      setText('executive-recommendation', D.executive.migration ? D.executive.migration.recommendation : '');
    }

    // MIGRATION
    if (viewId === 'migration') {
      makeKpiCards('kpi-migration', [
        { label: 'Source Platform', value: 'Source', status: 'info' },
        { label: 'Target Platform', value: 'Target', status: 'info' },
        { label: 'Source Records', value: '11', status: 'info' },
        { label: 'Target Records', value: '13', status: 'warning' },
        { label: 'Entities Mapped', value: '3', status: 'info' }
      ]);
      var entityTbody = document.getElementById('entity-table');
      if (entityTbody && D.migration && D.migration.entityMapping) {
        entityTbody.innerHTML = D.migration.entityMapping.map(function (e) {
          return '<tr><td>' + e.source + '</td><td>' + e.target + '</td><td>' + e.source_rows + '</td><td>' + e.target_rows + '</td><td>' + e.record_match_pct + '</td><td>' + makeStatusBadge(e.status) + '</td></tr>';
        }).join('');
      }
    }

    // VALIDATION
    if (viewId === 'validation') {
      var vs = (D.validation && D.validation.summary) || {};
      makeKpiCards('kpi-validation', [
        { label: 'Total Controls', value: String(vs.total || 9), status: 'info' },
        { label: 'Passed', value: String(vs.passed || 0), status: 'success' },
        { label: 'Failed', value: String(vs.failed || 0), status: 'warning' },
        { label: 'Error', value: String(vs.error || 0), status: 'error' },
        { label: 'Blocked', value: String(vs.blocked || 0), status: 'error' }
      ]);
      renderDonut('chart-val-dist', D.validation.valDist);
      var vtbody = document.getElementById('validation-table');
      if (vtbody && D.validation.controls) {
        vtbody.innerHTML = D.validation.controls.map(function (c) {
          return '<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + makeStatusBadge(c.status) + '</td><td>' + (c.total_rules || 0) + '</td><td>' + (c.passed || 0) + '</td><td>' + (c.failed || 0) + '</td><td>' + (c.errors || 0) + '</td></tr>';
        }).join('');
      }
    }

    // RISK
    if (viewId === 'risk') {
      makeKpiCards('kpi-risk', D.risk.kpi);
      var goEl = document.getElementById('go-nogo');
      if (goEl && D.risk.goNoGo) {
        var gng = D.risk.goNoGo;
        var gcls = gng.decision === 'NO-GO' ? 'nogo' : 'go';
        goEl.innerHTML = '<div class="go-nogo-card ' + gcls + '">' +
          '<h4>' + gng.decision + '</h4>' +
          '<p>' + gng.reason + '</p></div>';
      }
      var rtbody = document.getElementById('risks-table-body');
      if (rtbody && D.risk.risks) {
        rtbody.innerHTML = D.risk.risks.map(function (r) {
          return '<tr><td>' + r.id + '</td><td>' + r.risk + '</td><td>' + makeStatusBadge(r.severity) + '</td><td>' + r.impact + '</td><td>' + r.mitigation + '</td><td>' + makeStatusBadge(r.status) + '</td></tr>';
        }).join('');
      }
    }

    // QUALITY
    if (viewId === 'quality') {
      makeKpiCards('kpi-quality', [
        { label: 'Overall Quality', value: (D.quality.overallScore || 80) + '%', status: 'warning' },
        { label: 'Dimensions Scored', value: String(D.quality.dimensions ? D.quality.dimensions.length : 6), status: 'info' },
        { label: 'Best Dimension', value: 'Timeliness (90%)', status: 'success' },
        { label: 'Worst Dimension', value: 'Validity (58%)', status: 'error' }
      ]);
      renderRadar('chart-quality-radar', D.quality.dimensions);
      renderLine('chart-quality-trend', D.quality.trend);
      var dims = document.getElementById('quality-dimensions');
      if (dims && D.quality.dimensions) {
        dims.innerHTML = D.quality.dimensions.map(function (d) {
          var color = d.score >= 80 ? '#107C10' : d.score >= 60 ? '#FFB900' : '#D13438';
          return '<div class="quality-dim" role="listitem">' +
            '<span class="quality-dim-name">' + d.name + '</span>' +
            '<div class="quality-dim-bar"><div class="quality-dim-fill" style="width:' + d.score + '%;background:' + color + '" role="progressbar" aria-valuenow="' + d.score + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + d.name + ' score"></div></div>' +
            '<span class="quality-dim-score">' + d.score + '%</span></div>';
        }).join('');
      }
    }

    // GOVERNANCE
    if (viewId === 'governance') {
      makeKpiCards('kpi-governance', D.governance.kpi);
      renderBar('chart-issue-by-type', D.governance.issueByType);
      renderDonut('chart-severity-dist', D.governance.severityDist);
      var gtb = document.getElementById('governance-table');
      if (gtb && D.governance.findings) {
        gtb.innerHTML = D.governance.findings.map(function (f) {
          return '<tr><td>' + f.id + '</td><td>' + f.type + '</td><td>' + f.description + '</td><td>' + makeStatusBadge(f.severity) + '</td><td>' + f.control + '</td><td>' + f.owner + '</td><td>' + makeStatusBadge(f.status) + '</td></tr>';
        }).join('');
      }
    }

    // PROGRESS
    if (viewId === 'progress') {
      var tl = (D.progress && D.progress.timeline) || {};
      makeKpiCards('kpi-progress', [
        { label: 'Execution Duration', value: tl.duration || '27s', status: 'info' },
        { label: 'Phases Completed', value: (tl.phases_completed || 7) + '/' + (tl.total_phases || 10), status: 'warning' },
        { label: 'Controls Executed', value: String(D.validation && D.validation.summary ? D.validation.summary.total : 9), status: 'info' },
        { label: 'Rules Executed', value: String(D.progress.phases ? D.progress.phases.length : 10), status: 'info' },
        { label: 'Migration Status', value: D.landing.status || 'BLOCKED', status: 'error' }
      ]);
      var pb = document.getElementById('progress-bars');
      if (pb && D.progress.phases) {
        pb.innerHTML = D.progress.phases.map(function (p) {
          var cls = p.status === 'completed' ? 'completed' : p.status === 'in_progress' ? 'in_progress' : 'not_started';
          return '<div class="progress-item" role="listitem">' +
            '<div class="progress-item-header"><span class="progress-item-name">' + p.name + '</span><span class="progress-item-pct">' + p.progress + '%</span></div>' +
            '<div class="progress-bar"><div class="progress-bar-fill ' + cls + '" style="width:' + p.progress + '%" role="progressbar" aria-valuenow="' + p.progress + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + p.name + ' progress"></div></div></div>';
        }).join('');
      }
    }
  }

  // ----------------------------------------------------------
  // Chart Helpers
  // ----------------------------------------------------------
  function renderDonut(canvasId, data) {
    if (!data || !data.length) return;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    charts[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map(function (d) { return d.label; }),
        datasets: [{
          data: data.map(function (d) { return d.value; }),
          backgroundColor: data.map(function (d) { return d.color; }),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { position: 'right', labels: { padding: 16, usePointStyle: true } }
        },
        animation: { animateRotate: true, duration: 800 }
      }
    });
  }

  function renderBar(canvasId, data) {
    if (!data || !data.length) return;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    charts[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(function (d) { return d.label; }),
        datasets: [{
          data: data.map(function (d) { return d.value; }),
          backgroundColor: data.map(function (d) { return d.color; }),
          borderRadius: 4,
          maxBarThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#F3F4F6' } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        },
        animation: { duration: 600 }
      }
    });
  }

  function renderRadar(canvasId, dimensions) {
    if (!dimensions || !dimensions.length) return;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    charts[canvasId] = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: dimensions.map(function (d) { return d.name; }),
        datasets: [{
          label: 'Score',
          data: dimensions.map(function (d) { return d.score; }),
          backgroundColor: 'rgba(0,120,212,0.12)',
          borderColor: '#0078D4',
          borderWidth: 2,
          pointBackgroundColor: '#0078D4',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, font: { size: 10 }, backdropColor: 'transparent' },
            grid: { color: '#E5E7EB' },
            pointLabels: { font: { size: 11, family: "'Segoe UI', Arial, sans-serif" } }
          }
        },
        plugins: { legend: { display: false } },
        animation: { duration: 800 }
      }
    });
  }

  function renderLine(canvasId, trend) {
    if (!trend || !trend.length) return;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    charts[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: trend.map(function (d) { return d.label; }),
        datasets: [{
          label: 'Quality Score',
          data: trend.map(function (d) { return d.value; }),
          borderColor: '#0078D4',
          backgroundColor: 'rgba(0,120,212,0.06)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#0078D4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { font: { size: 11 } }, grid: { color: '#F3F4F6' } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        },
        plugins: { legend: { display: false } },
        animation: { duration: 800 }
      }
    });
  }

  // ----------------------------------------------------------
  // Utility
  // ----------------------------------------------------------
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  // ----------------------------------------------------------
  // Init
  // ----------------------------------------------------------
  renderTimestamp();

})();
