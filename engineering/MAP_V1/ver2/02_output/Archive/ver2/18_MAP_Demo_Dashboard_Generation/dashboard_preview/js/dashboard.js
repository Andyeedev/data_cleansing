/* MAP Nexus Dashboard — Navigation & Chart Rendering */

(function () {
  const views = document.querySelectorAll('.dashboard-view');
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const landingTiles = document.querySelectorAll('.landing-tile[data-view]');
  const pageTitle = document.getElementById('page-title');
  const pageNames = {
    home: 'Home', executive: 'Executive Dashboard', migration: 'Migration Overview',
    validation: 'Validation Centre', risk: 'Risk Assessment', quality: 'Data Quality',
    governance: 'Governance Centre', progress: 'Migration Progress'
  };

  const charts = {};

  function showView(id) {
    views.forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + id).classList.add('active');
    navItems.forEach(n => n.classList.remove('active'));
    document.querySelector('.nav-item[data-view="' + id + '"]').classList.add('active');
    pageTitle.textContent = pageNames[id] || id;
    renderCharts(id);
  }

  navItems.forEach(item => item.addEventListener('click', function (e) { e.preventDefault(); showView(this.dataset.view); }));
  landingTiles.forEach(item => item.addEventListener('click', function () { showView(this.dataset.view); }));

  function makeKpiCards(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = data.map(function (k) {
      return '<div class="kpi-card status-' + k.status + '"><div class="kpi-label">' + k.label + '</div><div class="kpi-value">' + k.value + '</div></div>';
    }).join('');
  }

  function makeStatusBadge(status) {
    var cls = 'info';
    if (status === 'passed' || status === 'PASSED') cls = 'success';
    else if (status === 'failed' || status === 'CRITICAL_ISSUE') cls = 'error';
    else if (status === 'attention_required' || status === 'ATTENTION_REQUIRED') cls = 'warning';
    return '<span class="badge badge-' + cls + '">' + status.replace('_', ' ') + '</span>';
  }

  function renderCharts(viewId) {
    if (charts._destroyed) return;
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
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 2 } } } }
      });
    }

    if (viewId === 'validation') {
      makeKpiCards('kpi-validation', [
        { label: "Total Controls", value: "10", status: "info" },
        { label: "Passed", value: "3", status: "success" },
        { label: "Attention Required", value: "2", status: "warning" },
        { label: "Critical Issue", value: "4", status: "error" },
        { label: "Disabled", value: "1", status: "info" }
      ]);
      charts.valDist = new Chart(document.getElementById('chart-val-dist'), {
        type: 'doughnut',
        data: { labels: D.validation.valDist.map(function (d) { return d.label; }), datasets: [{ data: D.validation.valDist.map(function (d) { return d.value; }), backgroundColor: D.validation.valDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
      });
      var tbody = document.getElementById('validation-table');
      tbody.innerHTML = D.validation.controls.map(function (c) {
        return '<tr><td>' + c.id + ' ' + c.name + '</td><td>' + makeStatusBadge(c.status) + '</td><td>' + c.severity + '</td><td>' + c.details + '</td></tr>';
      }).join('');
    }

    if (viewId === 'migration') {
      makeKpiCards('kpi-migration', [
        { label: "Source Platform", value: "T24 Transact", status: "info" },
        { label: "Target Platform", value: "Finacle", status: "info" },
        { label: "Source Records", value: "55,011", status: "info" },
        { label: "Target Records", value: "39,205", status: "warning" },
        { label: "Entities Mapped", value: "5", status: "info" }
      ]);
      var entityTbody = document.getElementById('entity-table');
      entityTbody.innerHTML = D.migration.entityMapping.map(function (e) {
        return '<tr><td>' + e.source + '</td><td>' + e.target + '</td><td>' + e.sourceRows.toLocaleString() + '</td><td>' + e.targetRows.toLocaleString() + '</td><td>' + e.matchPct + '</td><td>' + makeStatusBadge(e.status) + '</td></tr>';
      }).join('');
      var healthGrid = document.getElementById('system-health');
      healthGrid.innerHTML = D.migration.platformHealth.map(function (p) {
        return '<div class="health-card"><h4>' + p.name + '</h4>' +
          '<div class="health-item"><span class="health-label">CPU</span><span class="health-value" style="color:' + (p.cpu > 70 ? '#D13438' : '#107C10') + '">' + p.cpu + '%</span></div>' +
          '<div class="health-item"><span class="health-label">Memory</span><span class="health-value" style="color:' + (p.memory > 70 ? '#D13438' : '#107C10') + '">' + p.memory + '%</span></div>' +
          '<div class="health-item"><span class="health-label">Disk</span><span class="health-value" style="color:' + (p.disk > 70 ? '#FFB900' : '#107C10') + '">' + p.disk + '%</span></div>' +
          '</div>';
      }).join('');
    }

    if (viewId === 'risk') {
      makeKpiCards('kpi-risk', D.risk.kpi);
      document.getElementById('go-nogo').innerHTML = '<div class="go-nogo-card nogo"><h4>NO-GO</h4><p>Migration is currently blocked. Critical and high priority findings must be resolved before proceeding to pilot. 6 critical findings require immediate attention.</p></div>';
      var risksTbody = document.getElementById('risks-table-body');
      risksTbody.innerHTML = D.risk.risks.map(function (r) {
        return '<tr><td>' + r.id + '</td><td>' + r.risk + '</td><td>' + makeStatusBadge(r.severity) + '</td><td>' + r.impact + '</td><td>' + r.mitigation + '</td><td>' + makeStatusBadge(r.status) + '</td></tr>';
      }).join('');
    }

    if (viewId === 'quality') {
      makeKpiCards('kpi-quality', [
        { label: "Overall Quality", value: "80%", status: "warning" },
        { label: "Dimensions Scored", value: "6", status: "info" },
        { label: "Best Dimension", value: "Completeness (95%)", status: "success" },
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
        return '<tr><td>' + f.id + '</td><td>' + f.type + '</td><td>' + f.description + '</td><td>' + makeStatusBadge(f.severity) + '</td><td>' + f.owner + '</td><td>' + makeStatusBadge(f.status) + '</td><td>' + f.resolution + '</td></tr>';
      }).join('');
    }

    if (viewId === 'progress') {
      makeKpiCards('kpi-progress', [
        { label: "Overall Progress", value: "50%", status: "warning" },
        { label: "Days Elapsed", value: "169", status: "info" },
        { label: "Days Remaining", value: "181", status: "warning" },
        { label: "Phases Completed", value: "2/7", status: "info" },
        { label: "Phases In Progress", value: "2/7", status: "warning" },
        { label: "Phases Not Started", value: "3/7", status: "error" }
      ]);
      var pb = document.getElementById('progress-bars');
      pb.innerHTML = D.progress.phases.map(function (p) {
        var cls = p.status === 'completed' ? 'completed' : p.status === 'in_progress' ? 'in_progress' : 'not_started';
        return '<div class="progress-item"><div class="progress-item-header"><span class="progress-item-name">' + p.name + '</span><span class="progress-item-pct">' + p.progress + '%</span></div><div class="progress-bar"><div class="progress-bar-fill ' + cls + '" style="width:' + p.progress + '%"></div></div></div>';
      }).join('');
    }
  }
})();
