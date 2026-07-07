# MAP AI Security Standards

| Field | Value |
|-------|-------|
| **Document** | MAP AI Security Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Data Privacy

All AI interactions must protect personally identifiable information (PII) and sensitive data.

### Data Handling Rules

| Data Type | Allowed in Prompts | Handling |
|-----------|-------------------|----------|
| **PII** | No | Anonymize before prompting |
| **Credentials** | No | Use Azure Key Vault |
| **Financial Data** | No | Use synthetic data |
| **Business Logic** | Limited | Use generic examples |
| **Architecture** | Yes | Use generic patterns |
| **Public API** | Yes | Use official documentation |

### Data Classification

| Classification | Description | AI Usage |
|---------------|-------------|----------|
| **Public** | Publicly available information | Allowed |
| **Internal** | Internal company information | Limited |
| **Confidential** | Sensitive business information | Restricted |
| **Restricted** | Highly sensitive data | Prohibited |

---

## 2. Prompt Privacy

Prompts must not contain secrets, credentials, or sensitive information.

### Prompt Review Checklist

| Check | Description |
|-------|-------------|
| **No Secrets** | Verify no API keys, tokens, or passwords |
| **No PII** | Verify no personal information |
| **No Credentials** | Verify no database connection strings |
| **No Internal URLs** | Verify no internal hostnames or IPs |
| **No Business Secrets** | Verify no proprietary algorithms or logic |
| **No Financial Data** | Verify no account numbers or financial info |

---

## 3. Source Code Protection

Source code must be protected when using AI tools.

### Protection Guidelines

| Guideline | Description |
|-----------|-------------|
| **Enterprise Tools** | Use enterprise AI tools with code protection |
| **Data Retention** | Review AI tool data retention policies |
| **Opt-Out** | Opt out of model training on code |
| **Private Repos** | Use private repositories for AI-assisted code |
| **Access Control** | Restrict AI tool access to authorized users |
| **Audit Logging** | Log all AI interactions with code |

### Code Sharing Guidelines

| Scenario | Allowed | Requirements |
|----------|---------|--------------|
| **Public Code** | Yes | No restrictions |
| **Internal Code** | Limited | Use enterprise AI tools |
| **Confidential Code** | No | Do not share with AI |
| **Customer Code** | No | Do not share with AI |
| **Third-Party Code** | Limited | Check license compatibility |

---

## 4. Intellectual Property

AI tool usage must respect intellectual property rights.

### IP Protection Guidelines

| Guideline | Description |
|-----------|-------------|
| **Attribution** | Document AI contributions in code comments |
| **License Check** | Verify AI-generated code license compatibility |
| **Originality** | Ensure AI output is sufficiently original |
| **Third-Party** | Check for third-party code in AI output |
| **Documentation** | Maintain records of AI-assisted development |

---

## 5. Secrets Management

Secrets must never be included in prompts or source code.

### Secret Types

| Secret Type | Storage | Usage |
|-------------|---------|-------|
| **API Keys** | Azure Key Vault | Managed identity or SDK |
| **Connection Strings** | Azure Key Vault | Managed identity or SDK |
| **Passwords** | Azure Key Vault | Managed identity or SDK |
| **Certificates** | Azure Key Vault | Managed identity or SDK |
| **Encryption Keys** | Azure Key Vault | Managed identity or SDK |

### Secret Handling Rules

| Rule | Description |
|------|-------------|
| **Never in Prompts** | Never include secrets in AI prompts |
| **Never in Code** | Never hardcode secrets in source code |
| **Never in Logs** | Never log secrets or sensitive data |
| **Never in Comments** | Never include secrets in code comments |
| **Never in Commits** | Never commit secrets to version control |
| **Always in Key Vault** | Store all secrets in Azure Key Vault |

---

## 6. Credential Handling

Credentials must be managed securely using Azure best practices.

### Credential Management Rules

| Rule | Description |
|------|-------------|
| **Prefer Managed Identity** | Use Managed Identity for Azure resources |
| **No Hardcoded Credentials** | Never hardcode credentials in source code |
| **Use Azure Key Vault** | Store credentials in Azure Key Vault |
| **Rotate Regularly** | Rotate credentials regularly |
| **Least Privilege** | Grant minimum required permissions |
| **Audit Access** | Log all credential usage |

---

## 7. Sensitive Information

Sensitive information must be classified and protected.

### Data Classification Matrix

| Classification | Examples | AI Usage | Protection |
|---------------|----------|----------|------------|
| **Public** | Public docs, open source | Allowed | None |
| **Internal** | Internal docs, code | Limited | Access control |
| **Confidential** | Customer data, financials | Restricted | Encryption |
| **Restricted** | PII, PHI, credentials | Prohibited | Full protection |

### Usage Auditing

| Audit Event | Description | Retention |
|------------|-------------|-----------|
| **AI Request** | Prompt sent to AI | 90 days |
| **Data Detection** | Sensitive data detected | 1 year |
| **Policy Violation** | Security policy violated | 1 year |
| **Access Attempt** | Unauthorized access attempt | 1 year |
| **Credential Usage** | Credential accessed | 90 days |

---

## 8. Compliance

MAP must comply with relevant regulations and standards.

### Compliance Requirements

| Regulation | Requirements | MAP Implementation |
|-----------|--------------|-------------------|
| **GDPR** | Data protection, right to erasure | Data anonymization, retention policies |
| **SOC 2** | Security controls, audit trails | Access controls, logging |
| **PCI DSS** | Cardholder data protection | Encryption, access controls |
| **HIPAA** | Health data protection | Anonymization, access controls |
| **ISO 27001** | Information security management | Security policies, controls |
