# MAP MVP Security Coding Standards

| Field      | Value                                  |
|------------|----------------------------------------|
| Document   | MAP MVP Security Coding Standards      |
| Version    | 1.0                                    |
| Date       | July 2026                              |
| Status     | Official                               |

---

## 1. Secure Coding

### Core Principles

| Principle                | Description                                      |
|------------------------|--------------------------------------------------|
| Input Validation       | Validate all inputs on the server side; never trust client data |
| Output Encoding        | Encode all output to prevent injection attacks    |
| Least Privilege        | Grant minimum permissions required for operation  |
| Defense in Depth       | Apply multiple layers of security controls       |
| Fail Secure           | Default to deny; fail closed on errors           |
| Separation of Duties   | No single component has unrestricted access      |

### Secure Coding Checklist

- [ ] All inputs validated and sanitized
- [ ] Parameterized queries for all database access
- [ ] Output encoded for the appropriate context
- [ ] Authentication required on all endpoints
- [ ] Authorization checked before data access
- [ ] Secrets stored in Azure Key Vault, not in code
- [ ] Errors handled gracefully without leaking internals
- [ ] Logging excludes sensitive data
- [ ] Dependencies scanned for vulnerabilities

---

## 2. OWASP Top 10 Mitigations

### A01:2021 – Broken Access Control

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Deny by default                        | Authorization middleware on all routes  |
| CORS configuration                     | Explicit allowed origins, no wildcards |
| Resource-level permissions             | Check ownership on every data access   |
| JWT validation                         | Validate issuer, audience, expiry      |

```csharp
// Enforce resource-level authorization
[Authorize(Policy = "MigrationJobOwner")]
public async Task<IActionResult> GetMigrationJob(Guid jobId)
{
    var job = await _service.GetByIdAsync(jobId);
    if (job == null) return NotFound();
    return Ok(job);
}
```

### A02:2021 – Cryptographic Failures

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| TLS 1.2+ enforced                     | Minimum protocol in Azure configuration|
| AES-256 at rest                        | Azure SQL TDE, Blob storage encryption  |
| Key management                         | Azure Key Vault with HSM-backed keys   |
| No custom crypto                       | Use platform-provided cryptography      |

### A03:2021 – Injection

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Parameterized queries                  | EF Core parameterized queries           |
| Input validation                       | FluentValidation with allow-lists       |
| Output encoding                        | HTML encoding, content security policy  |
| ORM usage                              | Never concatenate SQL strings           |

```csharp
// SAFE - Parameterized via EF Core
var user = await context.Users
    .Where(u => u.Email == inputEmail)
    .FirstOrDefaultAsync();

// UNSAFE - Never do this
var user = await context.Users
    .FromSqlRaw($"SELECT * FROM Users WHERE Email = '{inputEmail}'")
    .FirstOrDefaultAsync();
```

### A04:2021 – Insecure Design

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Threat modeling                        | Review at design phase for each feature |
| Abuse case testing                     | Test unauthorized access scenarios      |
| Defense in depth                       | Multiple validation layers              |
| Secure design patterns                 | Repository, unit of work, middleware    |

### A05:2021 – Security Misconfiguration

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Minimal attack surface                 | Disable unused features and ports       |
| Error handling                         | Custom error pages, no stack traces     |
| Configuration management               | Infrastructure as Code, reviewed changes|
| Security headers                       | HSTS, X-Content-Type-Options, CSP       |

### A06:2021 – Vulnerable and Outdated Components

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Dependency scanning                    | Snyk integrated in CI                   |
| Automated updates                      | Dependabot PRs for patch versions       |
| Version pinning                        | Lock files committed                    |
| Vulnerability alerts                   | GitHub security advisories enabled      |

### A07:2021 – Identification and Authentication Failures

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Entra ID integration                   | No custom authentication                |
| MFA enforcement                        | Conditional access policies             |
| Password policies                      | Platform-managed, not custom            |
| Session management                     | Short-lived tokens, secure cookies      |

### A08:2021 – Software and Data Integrity Failures

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| CI/CD pipeline security                | Signed commits, protected branches      |
| Dependency verification                | Package checksums, lock files           |
| Code signing                           | Sign assemblies and containers          |
| Update integrity                       | Verify package signatures              |

### A09:2021 – Security Logging and Monitoring Failures

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| Audit logging                          | All auth events, data access logged     |
| Log integrity                          | Append-only storage, no tampering       |
| Alerting                               | Security event alerts to SOC            |
| Retention                              | 90-day minimum, compliant with policy   |

### A10:2021 – Server-Side Request Forgery (SSRF)

| Mitigation                              | Implementation                          |
|----------------------------------------|-----------------------------------------|
| URL validation                         | Allow-list approved domains             |
| Network segmentation                   | Container-level network policies        |
| Disable redirects                      | Follow-redirects disabled by default    |
| Response handling                      | Validate response content type          |

---

## 3. Secrets Management

### Azure Key Vault Integration

| Rule                                         | Enforcement                            |
|---------------------------------------------|----------------------------------------|
| No secrets in source code                   | Pre-commit hooks, CI scanning          |
| No secrets in configuration files           | Environment variables or Key Vault     |
| No secrets in logs or error messages        | Logging filters, redaction middleware   |
| No secrets in CI/CD pipeline logs           | Pipeline secret variables              |

### Key Vault Configuration

```json
{
  "KeyVault": {
    "VaultUri": "https://map-mvp-vault.vault.azure.net/",
    "SecretRotationSchedule": "P90D",
    "AccessPolicies": [
      {
        "Application": "map-mvp-api",
        "Permissions": ["get", "list"],
        "Secrets": ["database-connection", "openai-key", "redis-connection"]
      }
    ]
  }
}
```

### Rotation Schedule

| Secret Type               | Rotation Frequency  |
|--------------------------|---------------------|
| API keys                 | 90 days             |
| Connection strings       | 90 days             |
| Certificates             | 365 days            |
| Encryption keys          | 365 days            |
| Service principals       | 180 days            |

---

## 4. Encryption

### In Transit

| Requirement                           | Standard                              |
|---------------------------------------|---------------------------------------|
| Minimum TLS version                   | TLS 1.2                               |
| Cipher suites                         | Platform defaults (strong ciphers)    |
| Certificate management                | Azure App Service managed certificates|
| Internal service communication        | mTLS where possible                   |

### At Rest

| Data Type             | Encryption Method    | Key Source          |
|----------------------|---------------------|---------------------|
| Azure SQL MI         | TDE (AES-256)       | Service-managed     |
| Blob Storage         | SSE with CMK        | Key Vault           |
| Disk Encryption      | ADE                 | Key Vault           |
| Backups              | Service encryption  | Service-managed     |

### Key Management

- All encryption keys stored in Azure Key Vault
- HSM-backed keys for production workloads
- Key rotation every 365 days minimum
- Separate keys per environment
- Key versioning enabled

---

## 5. Authentication

### Entra ID Integration

```json
{
  "Authentication": {
    "Authority": "https://login.microsoftonline.com/{tenant-id}",
    "ClientId": "map-mvp-frontend-client-id",
    "Audience": "api://map-mvp-api",
    "ValidateIssuer": true,
    "ValidateAudience": true,
    "ValidateLifetime": true,
    "ClockSkew": "00:00:30"
  }
}
```

### Token Validation

- Validate issuer matches expected tenant
- Validate audience matches API identifier
- Validate token hasn't expired
- Validate signing key is from trusted authority
- Check token type (access vs ID token)

### Session Management

- Access tokens: 15-minute lifetime
- Refresh tokens: 8-hour lifetime, sliding expiration
- Token storage: HttpOnly secure cookies
- Session invalidation on password change

---

## 6. Authorization

### Role-Based Access Control (RBAC)

| Role                     | Permissions                                    |
|-------------------------|------------------------------------------------|
| Viewer                  | Read-only access to dashboards and reports      |
| Migration Operator      | Create, read, update migration jobs             |
| Migration Administrator | Full migration management, approve critical ops|
| Security Auditor        | Read access to logs and security events         |
| Platform Administrator   | Full system access, user management             |

### Policy-Based Authorization

```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("MigrationJobOwner", policy =>
        policy.Requirements.Add(new MigrationJobOwnerRequirement()));

    options.AddPolicy("CriticalOperation", policy =>
        policy.RequireRole("MigrationAdministrator")
              .RequireClaim("approval-level", "critical"));
});
```

### Principles

- **Deny by default:** All requests denied unless explicitly allowed
- **Resource-level permissions:** Check ownership on every data access
- **Separation of duties:** No single role can perform all operations
- **Audit trail:** Log all authorization decisions

---

## 7. Input Validation

### Server-Side Validation (Always)

- All input validation occurs server-side, never rely on client-side validation alone
- Validate on every layer: controller, service, repository
- Fail fast: reject invalid input as early as possible

### Validation Strategy

```csharp
public class MigrationJobValidator : AbstractValidator<CreateMigrationJobRequest>
{
    public MigrationJobValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100)
            .Matches(@"^[a-zA-Z0-9\s\-_]+$");

        RuleFor(x => x.SourceServer)
            .NotEmpty()
            .Must(BeValidServerName);

        RuleFor(x => x.TargetEnvironment)
            .IsInEnum();
    }

    private bool BeValidServerName(string serverName)
    {
        // Allow-list: only approved server patterns
        return Regex.IsMatch(serverName, @"^[a-zA-Z0-9\-\.]+$");
    }
}
```

### Rules

- Use **allow-lists** over deny-lists whenever possible
- Validate data types, ranges, lengths, and formats
- Use parameterized queries; never concatenate user input into queries
- Sanitize output for the target context (HTML, SQL, OS commands)

---

## 8. Logging

### What to Log

| Event                          | Level      | Details                         |
|-------------------------------|------------|---------------------------------|
| Authentication success        | Info       | User ID, timestamp, IP          |
| Authentication failure        | Warning    | User ID, reason, IP             |
| Authorization failure         | Warning    | User ID, resource, action       |
| Data access                   | Info       | User ID, resource, operation    |
| Input validation failure      | Warning    | Field, reason, source IP        |
| System errors                 | Error      | Exception details, correlation ID|

### What NOT to Log

- Passwords, API keys, secrets, tokens
- Full credit card numbers or PII
- Connection strings
- Stack traces in production (use correlation IDs instead)
- Full request/response bodies with sensitive data

### Structured Logging

```csharp
_logger.LogInformation(
    "Migration job {JobId} created by {UserId} at {Timestamp}",
    jobId, userId, DateTime.UtcNow);
```

### Audit Trail

- All data modification operations logged with before/after values
- Logs stored in immutable storage (Azure Monitor, Log Analytics)
- Retention: 90 days minimum, 1 year for compliance
- Correlation IDs propagated across all services

---

## 9. Dependency Scanning

### Automated Scanning

| Tool        | Type              | Frequency    | Block PR On   |
|------------|-------------------|--------------|---------------|
| Snyk       | SCA               | Every PR     | Critical/High |
| Dependabot | SCA               | Weekly       | Create PR     |
| Trivy      | Container image   | Every build  | Critical      |
| OWASP Dep Check | Java/JS SCA | Nightly     | High+         |

### Vulnerability Response

| Severity   | Response Time  | Action                              |
|-----------|----------------|--------------------------------------|
| Critical  | 24 hours       | Immediate patch, emergency release  |
| High      | 7 days         | Patch in next sprint                |
| Medium    | 30 days        | Scheduled update                    |
| Low       | 90 days        | Next convenient update              |

### License Compliance

- Only approved open-source licenses permitted
- Block PRs with copyleft licenses (GPL, AGPL) in proprietary components
- Track all dependency licenses in SBOM (Software Bill of Materials)

---

## 10. Static Analysis

### SonarQube

| Language        | Quality Gate Criteria                              |
|----------------|---------------------------------------------------|
| C#             | 0 bugs, 0 vulnerabilities, 0 hotspots, coverage ≥ 80% |
| TypeScript     | 0 bugs, 0 vulnerabilities, 0 code smells           |
| Python         | 0 bugs, 0 vulnerabilities, 0 code smells           |

### CodeQL

- Run on every PR for C#, JavaScript, TypeScript
- Query packs: security-and-quality
- Block merge on any security query finding

### ESLint Security Plugins

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:security/recommended"
  ],
  "plugins": ["security"],
  "rules": {
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-eval-with-expression": "error"
  }
}
```

### Integration

- All static analysis runs in CI pipeline
- Results published as PR comments
- Quality gate failures block merge
- Weekly review of new findings
