"""
MAP Presentation Engine — Module 01: Demo Package Builder
Assembles the self-contained HTML demo package from dashboard JSON data.

Usage:
    python app/scripts/build_demo_package.py
    python app/scripts/build_demo_package.py --input-dir <path-to-json> --output-dir <path-to-demo>
"""

import argparse
import json
import os
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.utils.logger import get_logger

logger = get_logger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_INPUT = BASE_DIR / "research" / "Packaging_our_Company" / "ver2" / "02_output" / "18_Presentation_Engine" / "dashboard_data" / "data"
DEFAULT_OUTPUT = BASE_DIR / "research" / "Packaging_our_Company" / "ver2" / "02_output" / "18_Presentation_Engine" / "Demo"


def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_data_js(data_dir):
    """Generate data.js from all JSON files."""
    files = {
        "executive": "01_Executive_Overview.json",
        "migration": "02_Migration_Overview.json",
        "validation": "03_Validation_Centre.json",
        "risk": "04_Risk_Assessment.json",
        "progress": "05_Migration_Progress.json",
        "quality": "06_Data_Quality.json",
        "governance": "07_Governance_Centre.json",
        "landing": "landing_page.json",
    }

    data = {}
    for key, filename in files.items():
        filepath = data_dir / filename
        if filepath.exists():
            data[key] = load_json(filepath)
        else:
            logger.warning(f"Missing {filename}, using empty data for {key}")
            data[key] = {}

    landing = data.get("landing", {}).get("landing", {})
    executive = data.get("executive", {})
    migration = data.get("migration", {})
    validation = data.get("validation", {})
    risk = data.get("risk", {})
    quality = data.get("quality", {})
    governance = data.get("governance", {})
    progress = data.get("progress", {})

    exec_charts = executive.get("charts", {})
    val_charts = validation.get("charts", {})
    gov_charts = governance.get("charts", {})

    js = f"""/* MAP Nexus Dashboard — Embedded Data (Module 00 Compliant) */
/* Source: MAP Presentation Engine — Module 01 */
/* Generated from live MAP execution */

const MAP_DATA = {{
  executive: {{
    kpi: {json.dumps(executive.get('kpi_cards', []))},
    issueDist: {json.dumps(exec_charts.get('issue_distribution', {}).get('data', []))},
    controlStatus: {json.dumps(exec_charts.get('control_status', {}).get('data', []))},
    migration: {json.dumps(executive.get('migration', {}))}
  }},
  migration: {{
    entityMapping: {json.dumps(migration.get('entity_mapping', []))}
  }},
  validation: {{
    controls: {json.dumps(validation.get('controls', []))},
    valDist: {json.dumps(val_charts.get('validation_distribution', {}).get('data', []))},
    summary: {json.dumps(validation.get('summary', {}))}
  }},
  risk: {{
    kpi: {json.dumps(risk.get('kpi_cards', []))},
    risks: {json.dumps(risk.get('risks', []))},
    goNoGo: {json.dumps(risk.get('go_no_go', {}))}
  }},
  quality: {{
    dimensions: {json.dumps(quality.get('dimensions', []))},
    trend: {json.dumps(quality.get('trend', []))},
    overallScore: {json.dumps(quality.get('overall_quality_score', 80))}
  }},
  governance: {{
    kpi: {json.dumps(governance.get('kpi_cards', []))},
    findings: {json.dumps(governance.get('findings', []))},
    issueByType: {json.dumps(gov_charts.get('findings_by_type', {}).get('data', []))},
    severityDist: {json.dumps(gov_charts.get('severity_distribution', {}).get('data', []))},
    summary: {json.dumps(governance.get('summary', {}))}
  }},
  progress: {{
    phases: {json.dumps(progress.get('phases', []))},
    timeline: {json.dumps(progress.get('timeline', {}))}
  }},
  landing: {{
    product: {json.dumps(landing.get('product', 'MAP Nexus\\u2122'))},
    subtitle: {json.dumps(landing.get('subtitle', 'Migration Assurance Platform'))},
    scenario: {json.dumps(landing.get('scenario', 'Scenario 3 \\u2014 MIXTURE'))},
    scenarioName: {json.dumps(landing.get('scenario_name', 'Customer Core Banking Migration'))},
    environment: {json.dumps(landing.get('environment', 'Enterprise Demonstration'))},
    executed: {json.dumps(landing.get('executed', ''))},
    status: {json.dumps(landing.get('status', 'BLOCKED'))},
    readiness: {json.dumps(landing.get('readiness', '62%'))},
    validationScore: {json.dumps(landing.get('validation_score', '58.3%'))},
    failedRules: {json.dumps(landing.get('failed_rules', '6'))},
    blockingControls: {json.dumps(landing.get('blocking_controls', '3'))}
  }}
}};
"""
    return js


def generate_dashboard_js():
    """Generate the dashboard.js navigation and chart rendering logic."""
    return """/* MAP Nexus Dashboard — Navigation & Chart Rendering (Module 00 Compliant) */

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
    var target = document.getElementById('view-' + id);
    if (target) target.classList.add('active');
    navItems.forEach(function (n) { n.classList.remove('active'); });
    var navTarget = document.querySelector('.nav-item[data-view="' + id + '"]');
    if (navTarget) navTarget.classList.add('active');
    if (pageTitle) pageTitle.textContent = pageNames[id] || id;
    renderCharts(id);
    window.location.hash = id;
  }

  navItems.forEach(function (item) { item.addEventListener('click', function (e) { e.preventDefault(); showView(this.dataset.view); }); });
  landingTiles.forEach(function (item) { item.addEventListener('click', function () { showView(this.dataset.view); }); });

  var hash = window.location.hash.replace('#', '');
  if (hash && pageNames[hash]) { showView(hash); } else { showView('home'); }

  function makeKpiCards(containerId, data) {
    var el = document.getElementById(containerId);
    if (!el || !data) return;
    el.innerHTML = data.map(function (k) {
      return '<div class="kpi-card status-' + k.status + '"><div class="kpi-label">' + k.label + '</div><div class="kpi-value">' + k.value + '</div></div>';
    }).join('');
  }

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
    return '<span class="badge badge-' + cls + '">' + status + '</span>';
  }

  function renderCharts(viewId) {
    Object.keys(charts).forEach(function (k) { if (charts[k]) { charts[k].destroy(); delete charts[k]; } });

    var D = MAP_DATA;

    if (viewId === 'home') {
      var ld = D.landing;
      var el = document.getElementById('landing-readiness');
      if (el) el.textContent = ld.readiness;
      el = document.getElementById('landing-score');
      if (el) el.textContent = ld.validationScore;
      el = document.getElementById('landing-failed');
      if (el) el.textContent = ld.failedRules;
      el = document.getElementById('landing-blocking');
      if (el) el.textContent = ld.blockingControls;
    }

    if (viewId === 'executive') {
      makeKpiCards('kpi-executive', D.executive.kpi);
      if (D.executive.issueDist && D.executive.issueDist.length) {
        charts.issueDist = new Chart(document.getElementById('chart-issue-dist'), {
          type: 'doughnut',
          data: { labels: D.executive.issueDist.map(function (d) { return d.label; }), datasets: [{ data: D.executive.issueDist.map(function (d) { return d.value; }), backgroundColor: D.executive.issueDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
        });
      }
      if (D.executive.controlStatus && D.executive.controlStatus.length) {
        charts.controlStatus = new Chart(document.getElementById('chart-control-status'), {
          type: 'bar',
          data: { labels: D.executive.controlStatus.map(function (d) { return d.label; }), datasets: [{ data: D.executive.controlStatus.map(function (d) { return d.value; }), backgroundColor: D.executive.controlStatus.map(function (d) { return d.color; }), borderRadius: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
      }
      var rec = document.getElementById('executive-recommendation');
      if (rec && D.executive.migration) {
        rec.textContent = D.executive.migration.recommendation || 'Review findings and proceed.';
      }
    }

    if (viewId === 'validation') {
      var vs = D.validation.summary || {};
      makeKpiCards('kpi-validation', [
        { label: "Total Controls", value: String(vs.total || 9), status: "info" },
        { label: "Passed", value: String(vs.passed || 0), status: "success" },
        { label: "Failed", value: String(vs.failed || 0), status: "warning" },
        { label: "Error", value: String(vs.error || 0), status: "error" },
        { label: "Blocked", value: String(vs.blocked || 0), status: "error" }
      ]);
      if (D.validation.valDist && D.validation.valDist.length) {
        charts.valDist = new Chart(document.getElementById('chart-val-dist'), {
          type: 'doughnut',
          data: { labels: D.validation.valDist.map(function (d) { return d.label; }), datasets: [{ data: D.validation.valDist.map(function (d) { return d.value; }), backgroundColor: D.validation.valDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
        });
      }
      var tbody = document.getElementById('validation-table');
      if (tbody && D.validation.controls) {
        tbody.innerHTML = D.validation.controls.map(function (c) {
          return '<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + makeStatusBadge(c.status) + '</td><td>' + (c.total_rules || 0) + '</td><td>' + (c.passed || 0) + '</td><td>' + (c.failed || 0) + '</td><td>' + (c.errors || 0) + '</td></tr>';
        }).join('');
      }
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
      if (entityTbody && D.migration.entityMapping) {
        entityTbody.innerHTML = D.migration.entityMapping.map(function (e) {
          return '<tr><td>' + e.source + '</td><td>' + e.target + '</td><td>' + e.source_rows + '</td><td>' + e.target_rows + '</td><td>' + e.record_match_pct + '</td><td>' + makeStatusBadge(e.status) + '</td></tr>';
        }).join('');
      }
    }

    if (viewId === 'risk') {
      makeKpiCards('kpi-risk', D.risk.kpi);
      var goEl = document.getElementById('go-nogo');
      if (goEl && D.risk.goNoGo) {
        var gng = D.risk.goNoGo;
        var cls = gng.decision === 'NO-GO' ? 'nogo' : 'go';
        goEl.innerHTML = '<div class="go-nogo-card ' + cls + '"><h4>' + gng.decision + '</h4><p>' + gng.reason + '</p></div>';
      }
      var risksTbody = document.getElementById('risks-table-body');
      if (risksTbody && D.risk.risks) {
        risksTbody.innerHTML = D.risk.risks.map(function (r) {
          return '<tr><td>' + r.id + '</td><td>' + r.risk + '</td><td>' + makeStatusBadge(r.severity) + '</td><td>' + r.impact + '</td><td>' + r.mitigation + '</td><td>' + makeStatusBadge(r.status) + '</td></tr>';
        }).join('');
      }
    }

    if (viewId === 'quality') {
      makeKpiCards('kpi-quality', [
        { label: "Overall Quality", value: (D.quality.overallScore || 80) + "%", status: "warning" },
        { label: "Dimensions Scored", value: String(D.quality.dimensions ? D.quality.dimensions.length : 6), status: "info" },
        { label: "Best Dimension", value: "Timeliness (90%)", status: "success" },
        { label: "Worst Dimension", value: "Validity (58%)", status: "error" }
      ]);
      if (D.quality.dimensions && D.quality.dimensions.length) {
        charts.radar = new Chart(document.getElementById('chart-quality-radar'), {
          type: 'radar',
          data: { labels: D.quality.dimensions.map(function (d) { return d.name; }), datasets: [{ label: 'Score', data: D.quality.dimensions.map(function (d) { return d.score; }), backgroundColor: 'rgba(0,120,212,0.15)', borderColor: '#0078D4', borderWidth: 2, pointBackgroundColor: '#0078D4' }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
        });
      }
      if (D.quality.trend && D.quality.trend.length) {
        charts.trend = new Chart(document.getElementById('chart-quality-trend'), {
          type: 'line',
          data: { labels: D.quality.trend.map(function (d) { return d.label; }), datasets: [{ label: 'Quality Score', data: D.quality.trend.map(function (d) { return d.value; }), borderColor: '#0078D4', backgroundColor: 'rgba(0,120,212,0.08)', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: '#0078D4' }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
        });
      }
      var dims = document.getElementById('quality-dimensions');
      if (dims && D.quality.dimensions) {
        dims.innerHTML = D.quality.dimensions.map(function (d) {
          var color = d.score >= 80 ? '#107C10' : d.score >= 60 ? '#FFB900' : '#D13438';
          return '<div class="quality-dim"><span class="quality-dim-name">' + d.name + '</span><div class="quality-dim-bar"><div class="quality-dim-fill" style="width:' + d.score + '%;background:' + color + '"></div></div><span class="quality-dim-score">' + d.score + '%</span></div>';
        }).join('');
      }
    }

    if (viewId === 'governance') {
      makeKpiCards('kpi-governance', D.governance.kpi);
      if (D.governance.issueByType && D.governance.issueByType.length) {
        charts.issueByType = new Chart(document.getElementById('chart-issue-by-type'), {
          type: 'bar',
          data: { labels: D.governance.issueByType.map(function (d) { return d.label; }), datasets: [{ data: D.governance.issueByType.map(function (d) { return d.value; }), backgroundColor: D.governance.issueByType.map(function (d) { return d.color; }), borderRadius: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
      }
      if (D.governance.severityDist && D.governance.severityDist.length) {
        charts.severityDist = new Chart(document.getElementById('chart-severity-dist'), {
          type: 'doughnut',
          data: { labels: D.governance.severityDist.map(function (d) { return d.label; }), datasets: [{ data: D.governance.severityDist.map(function (d) { return d.value; }), backgroundColor: D.governance.severityDist.map(function (d) { return d.color; }), borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 16 } } } }
        });
      }
      var govTbody = document.getElementById('governance-table');
      if (govTbody && D.governance.findings) {
        govTbody.innerHTML = D.governance.findings.map(function (f) {
          return '<tr><td>' + f.id + '</td><td>' + f.type + '</td><td>' + f.description + '</td><td>' + makeStatusBadge(f.severity) + '</td><td>' + f.control + '</td><td>' + f.owner + '</td><td>' + makeStatusBadge(f.status) + '</td></tr>';
        }).join('');
      }
    }

    if (viewId === 'progress') {
      var tl = D.progress.timeline || {};
      makeKpiCards('kpi-progress', [
        { label: "Execution Duration", value: tl.duration || "27s", status: "info" },
        { label: "Phases Completed", value: (tl.phases_completed || 7) + "/" + (tl.total_phases || 10), status: "warning" },
        { label: "Controls Executed", value: String(D.validation.summary ? D.validation.summary.total : 9), status: "info" },
        { label: "Rules Executed", value: String(D.progress.phases ? D.progress.phases.length : 10), status: "info" },
        { label: "Migration Status", value: D.landing.status || "BLOCKED", status: "error" }
      ]);
      var pb = document.getElementById('progress-bars');
      if (pb && D.progress.phases) {
        pb.innerHTML = D.progress.phases.map(function (p) {
          var cls = p.status === 'completed' ? 'completed' : p.status === 'in_progress' ? 'in_progress' : 'not_started';
          return '<div class="progress-item"><div class="progress-item-header"><span class="progress-item-name">' + p.name + '</span><span class="progress-item-pct">' + p.progress + '%</span></div><div class="progress-bar"><div class="progress-bar-fill ' + cls + '" style="width:' + p.progress + '%"></div></div></div>';
        }).join('');
      }
    }
  }
})();
"""


def generate_style_css():
    """:生成 the Azure-inspired CSS theme (Module 00 compliant)."""
    return """:root {
  --primary: #0078D4;
  --secondary: #003B75;
  --success: #107C10;
  --warning: #FFB900;
  --critical: #D13438;
  --info: #5C2D91;
  --background: #F8F9FB;
  --border: #E5E7EB;
  --font: 'Segoe UI', Arial, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; font-family: var(--font); background: var(--background); color: #1A1A1A; }

.app-layout { display: flex; height: 100vh; overflow: hidden; }

.sidebar {
  width: 240px; min-width: 240px; background: #0B2447; color: #C2C8D0;
  display: flex; flex-direction: column; overflow-y: auto;
}
.sidebar-brand { padding: 24px 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sidebar-brand h1 { font-size: 18px; font-weight: 700; color: #fff; }
.sidebar-brand .subtitle { font-size: 11px; color: #8892A0; margin-top: 4px; }
.sidebar-nav { flex: 1; padding: 12px 0; }
.nav-section { margin-bottom: 8px; }
.nav-section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #5A6577; padding: 8px 20px 4px; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: #A0AAB8;
  text-decoration: none; font-size: 13px; cursor: pointer; transition: all 0.15s ease; border-left: 3px solid transparent;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
.nav-item.active { background: rgba(0,120,212,0.15); color: #fff; border-left-color: var(--primary); font-weight: 600; }
.nav-icon { width: 18px; height: 18px; display: flex; align-items: center; }
.nav-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.sidebar-footer { padding: 12px 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #5A6577; }

.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.top-bar {
  display: flex; justify-content: space-between; align-items: center; padding: 16px 32px;
  background: #fff; border-bottom: 1px solid var(--border); min-height: 64px;
}
.top-bar h2 { font-size: 16px; font-weight: 700; color: #0B2447; }
.top-bar-right { display: flex; align-items: center; gap: 12px; }
.demo-badge { background: var(--info); color: #fff; font-size: 10px; padding: 3px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.status-badge { font-size: 11px; padding: 4px 10px; border-radius: 4px; font-weight: 600; }
.status-badge.success { background: #E6F4E6; color: var(--success); }
.status-badge.error { background: #FDECEA; color: var(--critical); }
.status-badge.warning { background: #FFF4CE; color: #8B6914; }

.content-area { flex: 1; overflow-y: auto; padding: 24px 32px; }
.dashboard-view { display: none; }
.dashboard-view.active { display: block; }

.card {
  background: #fff; border: 1px solid var(--border); border-radius: 10px;
  padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.card-header { margin-bottom: 16px; }
.card-header h3 { font-size: 14px; font-weight: 700; color: #0B2447; }
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
.kpi-card {
  background: #fff; border: 1px solid var(--border); border-radius: 10px;
  padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  border-left: 4px solid var(--primary);
}
.kpi-card.status-success { border-left-color: var(--success); }
.kpi-card.status-error { border-left-color: var(--critical); }
.kpi-card.status-warning { border-left-color: var(--warning); }
.kpi-card.status-info { border-left-color: var(--info); }
.kpi-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.kpi-value { font-size: 24px; font-weight: 700; color: #0B2447; }

.chart-container { position: relative; width: 100%; height: 280px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 10px 12px; background: #F8F9FB; color: #6B7280; font-weight: 600; border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; color: #374151; }
.data-table tr:hover td { background: #F8F9FB; }

.badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.badge-success { background: #E6F4E6; color: var(--success); }
.badge-error { background: #FDECEA; color: var(--critical); }
.badge-warning { background: #FFF4CE; color: #8B6914; }
.badge-info { background: #E8E0F0; color: var(--info); }

.section-header { margin-bottom: 20px; }
.section-header h3 { font-size: 18px; font-weight: 700; color: #0B2447; }
.section-header p { font-size: 13px; color: #6B7280; margin-top: 4px; }

.landing-page { text-align: center; padding: 60px 0; }
.landing-hero { margin-bottom: 24px; }
.logo-text { font-size: 48px; font-weight: 700; color: var(--primary); }
.logo-text span { font-weight: 300; color: var(--secondary); }
.landing-hero .tagline { font-size: 16px; color: #6B7280; margin-top: 8px; }
.env-badge { display: inline-block; background: var(--info); color: #fff; font-size: 11px; padding: 4px 12px; border-radius: 4px; margin-top: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.landing-meta { font-size: 12px; color: #9CA3AF; margin-bottom: 32px; }
.landing-stats { display: flex; justify-content: center; gap: 48px; margin-bottom: 48px; }
.landing-stat .value { font-size: 32px; font-weight: 700; color: #0B2447; }
.landing-stat .label { font-size: 12px; color: #6B7280; margin-top: 4px; }
.landing-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px; margin: 0 auto; text-align: left; }
.landing-tile {
  background: #fff; border: 1px solid var(--border); border-radius: 10px;
  padding: 24px; cursor: pointer; transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.landing-tile:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(0,120,212,0.12); transform: translateY(-2px); }
.tile-icon { width: 36px; height: 36px; background: rgba(0,120,212,0.08); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.tile-icon svg { width: 20px; height: 20px; fill: none; stroke: var(--primary); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.landing-tile h3 { font-size: 14px; font-weight: 700; color: #0B2447; margin-bottom: 4px; }
.landing-tile p { font-size: 12px; color: #6B7280; line-height: 1.4; }

.progress-item { margin-bottom: 16px; }
.progress-item-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
.progress-item-name { font-size: 13px; font-weight: 600; color: #374151; }
.progress-item-pct { font-size: 13px; font-weight: 700; color: #0B2447; }
.progress-bar { height: 10px; background: #E5E7EB; border-radius: 5px; overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: 5px; transition: width 0.6s ease; }
.progress-bar-fill.completed { background: var(--success); }
.progress-bar-fill.in_progress { background: var(--primary); }
.progress-bar-fill.not_started { background: #D1D5DB; }

.quality-dim { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
.quality-dim:last-child { border-bottom: none; }
.quality-dim-name { width: 120px; font-size: 13px; font-weight: 600; color: #374151; }
.quality-dim-bar { flex: 1; height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; }
.quality-dim-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.quality-dim-score { width: 40px; text-align: right; font-size: 13px; font-weight: 700; color: #0B2447; }

.go-nogo-card { padding: 16px; border-radius: 8px; text-align: center; }
.go-nogo-card.nogo { background: #FDECEA; border: 2px solid var(--critical); }
.go-nogo-card.go { background: #E6F4E6; border: 2px solid var(--success); }
.go-nogo-card h4 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.go-nogo-card.nogo h4 { color: var(--critical); }
.go-nogo-card.go h4 { color: var(--success); }
.go-nogo-card p { font-size: 13px; color: #6B7280; }

.content-area::-webkit-scrollbar { width: 6px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
"""


def generate_index_html():
    """Generate the landing page (Launch_MAP_Demo.html)."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAP Nexus\u2122 — Migration Assurance Platform</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    .launch-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #0078D4 0%, #003B75 100%); }
    .launch-card { background: #fff; border-radius: 16px; padding: 48px; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
    .launch-logo { font-size: 42px; font-weight: 700; color: #0078D4; margin-bottom: 8px; }
    .launch-logo span { font-weight: 300; color: #003B75; }
    .launch-subtitle { font-size: 16px; color: #6B7280; margin-bottom: 32px; }
    .launch-btn { display: inline-block; background: #0078D4; color: #fff; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.2s; }
    .launch-btn:hover { background: #005A9E; }
    .launch-meta { margin-top: 24px; font-size: 12px; color: #9CA3AF; }
  </style>
</head>
<body>
  <div class="launch-page">
    <div class="launch-card">
      <div class="launch-logo">MAP <span>Nexus\u2122</span></div>
      <div class="launch-subtitle">Migration Assurance Platform</div>
      <p style="font-size:14px; color:#616161; line-height:1.7; margin-bottom:24px;">Enterprise demonstration package. Run MAP against Scenario 3 \u2014 Financial Services Mixed Quality Migration.</p>
      <a href="dashboard/index.html" class="launch-btn">Launch Dashboard</a>
      <div class="launch-meta">Module 01 \u2014 Demonstration Execution Engine &middot; Version 1.0</div>
    </div>
  </div>
</body>
</html>"""


def generate_dashboard_html():
    """Generate the main SPA dashboard page."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAP Nexus\u2122 — Dashboard</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <h1>MAP Nexus\u2122</h1>
        <div class="subtitle">Migration Assurance Platform</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Navigation</div>
          <a class="nav-item active" data-view="home" href="#home">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
            <span>Home</span>
          </a>
          <a class="nav-item" data-view="executive" href="#executive">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg></span>
            <span>Executive Dashboard</span>
          </a>
          <a class="nav-item" data-view="migration" href="#migration">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></span>
            <span>Migration Overview</span>
          </a>
          <a class="nav-item" data-view="validation" href="#validation">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
            <span>Validation Centre</span>
          </a>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">Analysis</div>
          <a class="nav-item" data-view="risk" href="#risk">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
            <span>Risk Assessment</span>
          </a>
          <a class="nav-item" data-view="quality" href="#quality">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
            <span>Data Quality</span>
          </a>
          <a class="nav-item" data-view="governance" href="#governance">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
            <span>Governance Centre</span>
          </a>
          <a class="nav-item" data-view="progress" href="#progress">
            <span class="nav-icon"><svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
            <span>Migration Progress</span>
          </a>
        </div>
      </nav>
      <div class="sidebar-footer">
        <a href="../index.html" style="color:#A0AAB8; text-decoration:none; font-size:11px;">\u2190 Back to Launch Page</a>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <div class="top-bar-left"><h2 id="page-title">Home</h2></div>
        <div class="top-bar-right">
          <span class="demo-badge">Demo Environment</span>
          <span class="status-badge error">Migration Blocked</span>
          <span style="font-size:12px; color:#9E9E9E;">Scenario 3 \u2014 MIXTURE</span>
        </div>
      </header>

      <div class="content-area">
        <!-- HOME -->
        <div id="view-home" class="dashboard-view active">
          <div class="landing-page">
            <div class="landing-hero">
              <div class="logo-text">MAP <span>Nexus\u2122</span></div>
              <div class="tagline">Migration Assurance Platform</div>
              <div class="env-badge">Enterprise Demonstration</div>
            </div>
            <div class="landing-meta">Customer Core Banking Migration &middot; Scenario 3 \u2014 MIXTURE</div>
            <div class="landing-stats">
              <div class="landing-stat"><div class="value" id="landing-readiness">62%</div><div class="label">Readiness</div></div>
              <div class="landing-stat"><div class="value" id="landing-score">58.3%</div><div class="label">Validation Score</div></div>
              <div class="landing-stat"><div class="value" id="landing-failed">6</div><div class="label">Failed Rules</div></div>
              <div class="landing-stat"><div class="value" id="landing-blocking">3</div><div class="label">Blocking Controls</div></div>
            </div>
            <div class="landing-tiles">
              <div class="landing-tile" data-view="executive"><div class="tile-icon"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg></div><h3>Executive Dashboard</h3><p>High-level migration status and KPIs</p></div>
              <div class="landing-tile" data-view="validation"><div class="tile-icon"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><h3>Validation Centre</h3><p>Control execution results</p></div>
              <div class="landing-tile" data-view="migration"><div class="tile-icon"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div><h3>Migration Overview</h3><p>Source and target platform</p></div>
              <div class="landing-tile" data-view="quality"><div class="tile-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div><h3>Data Quality</h3><p>Quality dimensions and trends</p></div>
              <div class="landing-tile" data-view="risk"><div class="tile-icon"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><h3>Risk Assessment</h3><p>Risk matrix and go/no-go</p></div>
              <div class="landing-tile" data-view="governance"><div class="tile-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><h3>Governance Centre</h3><p>Findings and ownership</p></div>
            </div>
          </div>
        </div>

        <!-- EXECUTIVE -->
        <div id="view-executive" class="dashboard-view">
          <div class="section-header"><h3>Executive Dashboard</h3><p>Customer Core Banking Migration \u2014 Scenario 3 MIXTURE</p></div>
          <div class="kpi-grid" id="kpi-executive"></div>
          <div class="card-grid">
            <div class="card"><div class="card-header"><h3>Findings Distribution</h3></div><div class="chart-container"><canvas id="chart-issue-dist"></canvas></div></div>
            <div class="card"><div class="card-header"><h3>Control Status</h3></div><div class="chart-container"><canvas id="chart-control-status"></canvas></div></div>
          </div>
          <div class="card"><div class="card-header"><h3>Recommendation</h3></div><p id="executive-recommendation" style="font-size:14px; color:#616161;">Loading...</p></div>
        </div>

        <!-- MIGRATION -->
        <div id="view-migration" class="dashboard-view">
          <div class="section-header"><h3>Migration Overview</h3><p>Source and Target Platform Configuration</p></div>
          <div class="kpi-grid" id="kpi-migration"></div>
          <div class="card"><div class="card-header"><h3>Entity Mapping</h3></div><table class="data-table"><thead><tr><th>Source Entity</th><th>Target Entity</th><th>Source Records</th><th>Target Records</th><th>Match</th><th>Status</th></tr></thead><tbody id="entity-table"></tbody></table></div>
        </div>

        <!-- VALIDATION -->
        <div id="view-validation" class="dashboard-view">
          <div class="section-header"><h3>Validation Centre</h3><p>Control execution results</p></div>
          <div class="kpi-grid" id="kpi-validation"></div>
          <div class="card-grid">
            <div class="card"><div class="card-header"><h3>Validation Distribution</h3></div><div class="chart-container"><canvas id="chart-val-dist"></canvas></div></div>
            <div class="card"><div class="card-header"><h3>Control Results</h3></div><table class="data-table"><thead><tr><th>Control</th><th>Name</th><th>Status</th><th>Rules</th><th>Passed</th><th>Failed</th><th>Errors</th></tr></thead><tbody id="validation-table"></tbody></table></div>
          </div>
        </div>

        <!-- RISK -->
        <div id="view-risk" class="dashboard-view">
          <div class="section-header"><h3>Risk Assessment</h3><p>Overall risk evaluation and go/no-go decision</p></div>
          <div class="kpi-grid" id="kpi-risk"></div>
          <div class="card"><div class="card-header"><h3>Go / No-Go Decision</h3></div><div id="go-nogo"></div></div>
          <div class="card"><div class="card-header"><h3>Top Risks</h3></div><table class="data-table"><thead><tr><th>#</th><th>Risk</th><th>Severity</th><th>Impact</th><th>Mitigation</th><th>Status</th></tr></thead><tbody id="risks-table-body"></tbody></table></div>
        </div>

        <!-- QUALITY -->
        <div id="view-quality" class="dashboard-view">
          <div class="section-header"><h3>Data Quality</h3><p>Quality dimensions and trends</p></div>
          <div class="kpi-grid" id="kpi-quality"></div>
          <div class="card-grid">
            <div class="card"><div class="card-header"><h3>Quality Radar</h3></div><div class="chart-container"><canvas id="chart-quality-radar"></canvas></div></div>
            <div class="card"><div class="card-header"><h3>Quality Trend</h3></div><div class="chart-container"><canvas id="chart-quality-trend"></canvas></div></div>
          </div>
          <div class="card"><div class="card-header"><h3>Quality Dimensions</h3></div><div id="quality-dimensions"></div></div>
        </div>

        <!-- GOVERNANCE -->
        <div id="view-governance" class="dashboard-view">
          <div class="section-header"><h3>Governance Centre</h3><p>Findings, severity, and ownership</p></div>
          <div class="kpi-grid" id="kpi-governance"></div>
          <div class="card-grid">
            <div class="card"><div class="card-header"><h3>Findings by Type</h3></div><div class="chart-container"><canvas id="chart-issue-by-type"></canvas></div></div>
            <div class="card"><div class="card-header"><h3>Severity Distribution</h3></div><div class="chart-container"><canvas id="chart-severity-dist"></canvas></div></div>
          </div>
          <div class="card"><div class="card-header"><h3>All Findings</h3></div><table class="data-table"><thead><tr><th>ID</th><th>Type</th><th>Description</th><th>Severity</th><th>Control</th><th>Owner</th><th>Status</th></tr></thead><tbody id="governance-table"></tbody></table></div>
        </div>

        <!-- PROGRESS -->
        <div id="view-progress" class="dashboard-view">
          <div class="section-header"><h3>Migration Progress</h3><p>Phase completion and execution timeline</p></div>
          <div class="kpi-grid" id="kpi-progress"></div>
          <div class="card"><div class="card-header"><h3>Phase Progress</h3></div><div id="progress-bars"></div></div>
        </div>
      </div>
    </main>
  </div>
  <script src="../js/chart.min.js"></script>
  <script src="../js/data.js"></script>
  <script src="../js/dashboard.js"></script>
</body>
</html>"""


def copy_chart_js(output_dir):
    """Copy Chart.js from the archive if not present."""
    chart_target = output_dir / "js" / "chart.min.js"
    if chart_target.exists():
        return

    candidates = [
        BASE_DIR / "research" / "Packaging_our_Company" / "ver2" / "02_output" / "Archive" / "ver3" / "18_MAP_Demo_Dashboard_Generation" / "Demo_Package" / "js" / "chart.min.js",
        BASE_DIR / "research" / "Packaging_our_Company" / "ver2" / "02_output" / "Archive" / "ver2" / "18_MAP_Demo_Dashboard_Generation" / "Demo_Package" / "js" / "chart.min.js",
        BASE_DIR / "research" / "Packaging_our_Company" / "ver2" / "02_output" / "Archive" / "ver1" / "18_MAP_Demo_Dashboard_Generation" / "dashboard_preview" / "js" / "chart.min.js",
    ]

    for src in candidates:
        if src.exists():
            chart_target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, chart_target)
            logger.info(f"Copied Chart.js from {src}")
            return

    logger.warning("Chart.js not found in archive. Dashboard charts will not render.")


def main():
    parser = argparse.ArgumentParser(description="MAP Presentation Engine — Demo Package Builder")
    parser.add_argument("--input-dir", help="Directory containing dashboard JSON files")
    parser.add_argument("--output-dir", help="Output directory for the Demo package")
    args = parser.parse_args()

    input_dir = Path(args.input_dir) if args.input_dir else DEFAULT_INPUT
    output_dir = Path(args.output_dir) if args.output_dir else DEFAULT_OUTPUT

    logger.info(f"Building demo package from {input_dir} to {output_dir}")

    # Create directory structure
    (output_dir / "dashboard").mkdir(parents=True, exist_ok=True)
    (output_dir / "css").mkdir(parents=True, exist_ok=True)
    (output_dir / "js").mkdir(parents=True, exist_ok=True)
    (output_dir / "data").mkdir(parents=True, exist_ok=True)

    # Copy JSON data files
    for json_file in input_dir.glob("*.json"):
        shutil.copy2(json_file, output_dir / "data" / json_file.name)
        logger.info(f"Copied {json_file.name}")

    # Generate data.js
    data_js = generate_data_js(input_dir)
    (output_dir / "js" / "data.js").write_text(data_js, encoding="utf-8")
    logger.info("Generated js/data.js")

    # Generate dashboard.js
    dashboard_js = generate_dashboard_js()
    (output_dir / "js" / "dashboard.js").write_text(dashboard_js, encoding="utf-8")
    logger.info("Generated js/dashboard.js")

    # Generate style.css
    style_css = generate_style_css()
    (output_dir / "css" / "style.css").write_text(style_css, encoding="utf-8")
    logger.info("Generated css/style.css")

    # Generate HTML files
    index_html = generate_index_html()
    (output_dir / "index.html").write_text(index_html, encoding="utf-8")
    logger.info("Generated index.html")

    dashboard_html = generate_dashboard_html()
    (output_dir / "dashboard" / "index.html").write_text(dashboard_html, encoding="utf-8")
    logger.info("Generated dashboard/index.html")

    # Copy Chart.js
    copy_chart_js(output_dir)

    logger.info(f"Demo package built: {output_dir}")
    print(f"\n  Demo package: {output_dir}")
    print(f"  Entry point:  {output_dir / 'index.html'}")
    print(f"  Dashboard:    {output_dir / 'dashboard' / 'index.html'}")


if __name__ == "__main__":
    main()
