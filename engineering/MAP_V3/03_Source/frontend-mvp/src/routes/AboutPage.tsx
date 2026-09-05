import { Shield, Eye, Zap, BarChart3, CheckCircle, Server, Users } from 'lucide-react';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard } from '../components/reports/reportWidgets';

export function AboutPage() {
  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              MAP <span className="font-light">Nexus</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Migration Assurance Platform</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Enterprise-grade data migration validation</p>
          <p className="text-xs text-gray-400 italic mt-0.5">Every migration validated. Every outcome assured.</p>
        </div>
      </div>

      {/* ========== KEY METRICS ========== */}
      <ReportCard title="Impact at a Glance" subtitle="Platform performance metrics">
        <div className="grid grid-cols-3 gap-4">
          <KpiBox label="Readiness Visibility" value="62%" tone="success" />
          <KpiBox label="Critical Findings Detected" value={6} tone="critical" />
          <KpiBox label="Execution Time" value="27s" tone="info" />
        </div>
      </ReportCard>

      {/* ========== PRODUCT OVERVIEW ========== */}
      <ReportCard title="Product Overview" subtitle="What MAP Nexus delivers">
        <p className="text-sm text-neutral-80 leading-[1.7] mb-4">
          MAP Nexus is an enterprise-grade Migration Assurance Platform that validates data
          migrations before they happen. It detects critical findings &mdash; schema drift, balance
          discrepancies, permission gaps &mdash; before they become costly failures.
        </p>
        <p className="text-sm text-primary-500 leading-[1.7] italic font-medium">
          Every migration validated. Every outcome assured.
        </p>
      </ReportCard>

      {/* ========== MISSION & VISION ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReportCard title="Mission">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-sm text-neutral-80 leading-[1.7]">
              To empower every organization with reliable, auditable, and intelligent data migration
              assurance that eliminates risk and ensures business continuity.
            </p>
          </div>
        </ReportCard>
        <ReportCard title="Vision">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-sm text-neutral-80 leading-[1.7]">
              To become the industry standard for data migration validation, making zero-risk
              migration a reality for enterprises worldwide.
            </p>
          </div>
        </ReportCard>
      </div>

      {/* ========== BUSINESS PROBLEM & SOLUTION ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReportCard title="Business Problem">
          <p className="text-sm text-neutral-80 leading-[1.7]">
            Data migrations fail at alarming rates. Schema drift, balance discrepancies, and permission
            gaps cause data loss, regulatory non-compliance, and costly remediation. Organisations need
            a systematic way to validate migrations before they happen.
          </p>
        </ReportCard>
        <ReportCard title="MAP Solution">
          <p className="text-sm text-neutral-80 leading-[1.7]">
            MAP Nexus provides automated validation controls, real-time dashboards, and risk assessment.
            It executes 9 validation controls against source and target systems, generating
            executive-ready reports and go/no-go recommendations.
          </p>
        </ReportCard>
      </div>

      {/* ========== KEY CAPABILITIES ========== */}
      <ReportCard title="Key Capabilities">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: '9 Validation Controls', desc: 'Record completeness, financial integrity, referential integrity, schema drift, and more' },
            { title: 'Real-time Dashboard', desc: '8 executive views with interactive charts and data tables' },
            { title: 'Risk Assessment', desc: 'Automated go/no-go decision support with risk scoring' },
            { title: 'Governance Centre', desc: 'Findings tracking, severity classification, and resolution management' },
          ].map((cap) => (
            <div key={cap.title} className="bg-neutral-10 rounded-lg px-5 py-4 border border-neutral-30">
              <strong className="text-sm text-primary-500 font-semibold">{cap.title}</strong>
              <p className="text-xs text-neutral-70 mt-1 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </ReportCard>

      {/* ========== WHAT MAP DELIVERS ========== */}
      <ReportCard title="What MAP Delivers">
        <ul className="space-y-3">
          {[
            { label: 'Automated Validation:', desc: 'Execute validation controls automatically against source and target data' },
            { label: 'Governance Integration:', desc: 'Real-time governance decisions with full audit trail' },
            { label: 'Executive Visibility:', desc: 'Dashboard and reporting for stakeholders at every level' },
            { label: 'Risk Assessment:', desc: 'Automated risk scoring with go/no-go recommendations' },
            { label: 'Data Quality Analysis:', desc: 'Multi-dimensional quality assessment with trend tracking' },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <CheckCircle className="w-[18px] h-[18px] text-success-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-80 leading-[1.7]">
                <strong className="text-neutral-100">{item.label}</strong> {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </ReportCard>

      {/* ========== BENEFITS ========== */}
      <ReportCard title="Benefits">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: Shield, title: 'Reduce Risk', desc: 'Eliminate data loss and corruption through automated validation controls executed before, during, and after migration.', accent: 'bg-success-50 text-success-500' },
            { icon: CheckCircle, title: 'Ensure Compliance', desc: 'Maintain full audit trail of all validation activities with governance decision tracking for regulatory requirements.', accent: 'bg-primary-50 text-primary-500' },
            { icon: Zap, title: 'Accelerate Migration', desc: 'Reduce migration timelines by 40-60% through automated validation and real-time issue detection.', accent: 'bg-warning-50 text-warning-500' },
            { icon: BarChart3, title: 'Improve Quality', desc: 'Multi-dimensional data quality analysis ensures data meets business requirements post-migration.', accent: 'bg-information-50 text-information-500' },
          ].map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4 bg-neutral-10 rounded-lg p-5 border border-neutral-30">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${benefit.accent}`}>
                <benefit.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 mb-1.5">{benefit.title}</h3>
                <p className="text-xs text-neutral-80 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ReportCard>

      {/* ========== AZURE ALIGNMENT ========== */}
      <ReportCard title="Azure Alignment">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Server className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-neutral-80 leading-[1.7] mb-3">
              MAP Nexus is designed for enterprise Azure environments. It integrates with Microsoft
              Entra ID for authentication, Azure SQL Managed Instance for data, and Azure OpenAI
              for intelligent analysis. The platform is cloud-native and scales with your migration
              programme.
            </p>
            <p className="text-sm text-neutral-80 leading-[1.7]">
              We are proud participants in the Microsoft Founders Hub program, working alongside
              Microsoft to deliver enterprise-grade data migration solutions.
            </p>
          </div>
        </div>
      </ReportCard>

      {/* ========== FOUNDER ========== */}
      <ReportCard title="Founder">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-sm text-neutral-80 leading-[1.7]">
            MAP Nexus was founded by a team of enterprise data architects and migration specialists
            with combined experience of over 50 years in data management, cloud architecture, and
            enterprise software delivery. Our team has successfully delivered data migration projects
            for Fortune 500 companies across financial services, healthcare, and manufacturing sectors.
          </p>
        </div>
      </ReportCard>

      {/* ========== FOOTER ========== */}
      <div className="text-center py-8 border-t border-gray-200 mt-4">
        <p className="text-xs text-gray-400">
          MAP Nexus &mdash; Migration Assurance Platform
        </p>
      </div>
    </PageContainer>
  );
}
