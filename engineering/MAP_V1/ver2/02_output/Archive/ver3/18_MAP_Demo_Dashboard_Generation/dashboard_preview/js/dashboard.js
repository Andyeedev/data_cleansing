/* MAP Nexus Dashboard — Navigation & Chart Rendering */

(function () {
  var views = document.querySelectorAll('.dashboard-view');
  var navItems = document.querySelectorAll('.nav-item[data-view]');
  var landingTiles = document.querySelectorAll('.landing-tile[data-view]');
  var pageTitle = document.getElementById('page-title');
  var pageNames = {
    home: 'Home', executive: 'Executive Dashboard', migration: 'Migration Overview',
    validation: 'Validation Centre', risk: 'Risk Assessment', quality: 'Data Quality',
    governance: 'Governance Centre', progress: 'Migration Progress'
  };

  var charts = {};

  function showView(id) {
    views.forEach(function (v) { v.classList.remove('active'); });
    document.getElementById('view-' + id).classList.add('active');
    navItems.forEach(function (n) { n.classList.remove('active'); });
    document.querySelector('.nav-item[data-view="' + id + '"]').classList.add('active');
    pageTitle.textContent = pageNames[id] || id;
    renderCharts(id);
  }

  navItems.forEach(function (item) { item.addEventListener('click', function (e) { e.preventDefault(); showView(this.dataset.view); }); });
  landingTiles.forEach(function (item) { item.addEventListener('click', function () { showView(this.dataset.view); }); });

  function makeKpiCards(containerId, data) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = data.map(function (k) {
      return '<div class="kpi-card status-' + k.status + '"><div class="kpi-label">' + k.label + '</div><div class="kpi-value">' + k.value + '</div></div>';
    }).join('');
  }

  function makeStatusBadge(status) {
    var cls = 'info';
    var s = status.toUpperCase();
    if (s === 'PASS' || s === 'PASSED') cls = 'success';
    else if (s === 'FAIL' || s === 'FAILED' || s === 'BLOCKED') cls = 'error';
    else if (s === 'ERROR') cls = 'error';
    return '<span class="badge badge-' + cls + '">' + status + '</span>';
  }

  function renderCharts(viewId) {
    Object.keys(charts).forEach(function (k) { if (charts[k]) { charts[k].destroy(); delete charts[k]; } });

    var D = MAP_DATA;

    if (viewId === 'executive') {
      makeKpiCards('kpi-executive', D.executive.kpi);
      charts.issueDist = new Chart(document.getElementById('chart-issue-dist'), {
        type: 'doughnut',
        data: { labels: D.executive.issueDist.map(function (d) { return d.label; }), datasets: [{ data: D.executive.issueDist.map(function (d) { return d.value; }), backgroundColor: D.executive.issueDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
      });
      charts.controlStatus = new Chart(document.getElementById('chart-control-status'), {
        type: 'bar',
        data: { labels: D.executive.controlStatus.map(function (d) { return d.label; }), datasets: [{ data: D.executive.controlStatus.map(function (d) { return d.value; }), backgroundColor: D.executive.controlStatus.map(function (d) { return d.color; }), borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });
    }

    if (viewId === 'validation') {
      makeKpiCards('kpi-validation', [
        { label: "Total Controls", value: "9", status: "info" },
        { label: "Passed", value: "2", status: "success" },
        { label: "Failed", value: "1", status: "warning" },
        { label: "Error", value: "5", status: "error" },
        { label: "Blocked", value: "1", status: "error" }
      ]);
      charts.valDist = new Chart(document.getElementById('chart-val-dist'), {
        type: 'doughnut',
        data: { labels: D.validation.valDist.map(function (d) { return d.label; }), datasets: [{ data: D.validation.valDist.map(function (d) { return d.value; }), backgroundColor: D.validation.valDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
      });
      var tbody = document.getElementById('validation-table');
      tbody.innerHTML = D.validation.controls.map(function (c) {
        return '<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + makeStatusBadge(c.status) + '</td><td>' + c.totalRules + '</td><td>' + c.passed + '</td><td>' + c.failed + '</td><td>' + c.errors + '</td></tr>';
      }).join('');
    }

    if (viewId === 'migration') {
      makeKpiCards('kpi-migration', [
        { label: "Source Platform", value: "Source", status: "info" },
        { label: "Target Platform", value: "Target", status: "info" },
        { label: "Source Records", value: "11", status: "info" },
        { label: "Target Records", value: "13", status: "warning" },
        { label: "Entities Mapped", value: "3", status: "info" }
      ]);
      var entityTbody = document.getElementById('entity-table');
      entityTbody.innerHTML = D.migration.entityMapping.map(function (e) {
        return '<tr><td>' + e.source + '</td><td>' + e.target + '</td><td>' + e.sourceRows + '</td><td>' + e.targetRows + '</td><td>' + e.matchPct + '</td><td>' + makeStatusBadge(e.status) + '</td></tr>';
      }).join('');
    }

    if (viewId === 'risk') {
      makeKpiCards('kpi-risk', D.risk.kpi);
      document.getElementById('go-nogo').innerHTML = '<div class="go-nogo-card nogo"><h4>NO-GO</h4><p>Migration is BLOCKED. 3 controls are blocking progression with 6 failed rules. Schema drift, financial integrity, and referential integrity issues must be resolved before proceeding.</p></div>';
      var risksTbody = document.getElementById('risks-table-body');
      risksTbody.innerHTML = D.risk.risks.map(function (r) {
        return '<tr><td>' + r.id + '</td><td>' + r.risk + '</td><td>' + makeStatusBadge(r.severity) + '</td><td>' + r.impact + '</td><td>' + r.mitigation + '</td><td>' + makeStatusBadge(r.status) + '</td></tr>';
      }).join('');
    }

    if (viewId === 'quality') {
      makeKpiCards('kpi-quality', [
        { label: "Overall Quality", value: "80%", status: "warning" },
        { label: "Dimensions Scored", value: "6", status: "info" },
        { label: "Best Dimension", value: "Timeliness (90%)", status: "success" },
        { label: "Worst Dimension", value: "Validity (58%)", status: "error" }
      ]);
      charts.radar = new Chart(document.getElementById('chart-quality-radar'), {
        type: 'radar',
        data: { labels: D.quality.dimensions.map(function (d) { return d.name; }), datasets: [{ label: 'Score', data: D.quality.dimensions.map(function (d) { return d.score; }), backgroundColor: 'rgba(0,120,212,0.15)', borderColor: '#0078D4', borderWidth: 2, pointBackgroundColor: '#0078D4' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
      });
      charts.trend = new Chart(document.getElementById('chart-quality-trend'), {
        type: 'line',
        data: { labels: D.quality.trend.map(function (d) { return d.label; }), datasets: [{ label: 'Quality Score', data: D.quality.trend.map(function (d) { return d.value; }), borderColor: '#0078D4', backgroundColor: 'rgba(0,120,212,0.08)', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: '#0078D4' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
      });
      var dims = document.getElementById('quality-dimensions');
      dims.innerHTML = D.quality.dimensions.map(function (d) {
        var color = d.score >= 80 ? '#107C10' : d.score >= 60 ? '#FFB900' : '#D13438';
        return '<div class="quality-dim"><span class="quality-dim-name">' + d.name + '</span><div class="quality-dim-bar"><div class="quality-dim-fill" style="width:' + d.score + '%;background:' + color + '"></div></div><span class="quality-dim-score">' + d.score + '%</span></div>';
      }).join('');
    }

    if (viewId === 'governance') {
      makeKpiCards('kpi-governance', D.governance.kpi);
      charts.issueByType = new Chart(document.getElementById('chart-issue-by-type'), {
        type: 'bar',
        data: { labels: D.governance.issueByType.map(function (d) { return d.label; }), datasets: [{ data: D.governance.issueByType.map(function (d) { return d.value; }), backgroundColor: D.governance.issueByType.map(function (d) { return d.color; }), borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });
      charts.severityDist = new Chart(document.getElementById('chart-severity-dist'), {
        type: 'doughnut',
        data: { labels: D.governance.severityDist.map(function (d) { return d.label; }), datasets: [{ data: D.governance.severityDist.map(function (d) { return d.value; }), backgroundColor: D.governance.severityDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
      });
      var govTbody = document.getElementById('governance-table');
      govTbody.innerHTML = D.governance.findings.map(function (f) {
        return '<tr><td>' + f.id + '</td><td>' + f.type + '</td><td>' + f.description + '</td><td>' + makeStatusBadge(f.severity) + '</td><td>' + f.control + '</td><td>' + f.owner + '</td><td>' + makeStatusBadge(f.status) + '</td></tr>';
      }).join('');
    }

    if (viewId === 'progress') {
      makeKpiCards('kpi-progress', [
        { label: "Execution Duration", value: "27s", status: "info" },
        { label: "Phases Completed", value: "7/10", status: "warning" },
        { label: "Controls Executed", value: "9", status: "info" },
        { label: "Rules Executed", value: "19", status: "info" },
        { label: "Migration Status", value: "BLOCKED", status: "error" }
      ]);
      var pb = document.getElementById('progress-bars');
      pb.innerHTML = D.progress.phases.map(function (p) {
        var cls = p.status === 'completed' ? 'completed' : p.status === 'in_progress' ? 'in_progress' : 'not_started';
        return '<div class="progress-item"><div class="progress-item-header"><span class="progress-item-name">' + p.name + '</span><span class="progress-item-pct">' + p.progress + '%</span></div><div class="progress-bar"><div class="progress-bar-fill ' + cls + '" style="width:' + p.progress + '%"></div></div></div>';
      }).join('');
    }
  }
})();
