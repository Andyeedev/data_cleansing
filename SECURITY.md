# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in MAP Nexus, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### Contact

- Email: mapnexus@outlook.com
- Subject line: `[SECURITY] <brief description>`

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

### Response timeline

- **Acknowledgement:** Within 48 hours
- **Initial assessment:** Within 5 business days
- **Fix timeline:** Dependent on severity

## Dependency Management

### Scanning schedule

| Tool | Frequency | Scope |
|------|-----------|-------|
| `npm audit` | Before each release | Frontend dependencies |
| `pip-audit` | Before each release | Python dependencies |
| `bandit` | Before each release | Python source code SAST |

### Version pinning

All production dependencies are pinned to exact versions in `requirements.txt` and `package.json`. Updates require:

1. Run vulnerability scan (`npm audit`, `pip-audit`)
2. Review changelog for breaking changes
3. Test in development environment
4. Update pinned version
5. Commit with evidence of scan results

### SBOM

Software Bill of Materials (SBOM) is generated in CycloneDX format at each release:
- `engineering/MAP_V3/02_output/00_MAP_V3_Control/sbom.json`

## Security Controls

### Authentication
- JWT tokens stored in httpOnly Secure cookies (SameSite=Strict)
- 2-hour token expiry
- Account lockout after 5 failed attempts (15-minute cooldown)
- Password policy: 8+ characters, uppercase, lowercase, digit
- Session invalidation via token_version column

### Authorization
- Role-Based Access Control (RBAC) with tenant scoping
- Tenant isolation enforced on all data access paths
- `get_current_user_with_tenant` dependency on protected routes

### Infrastructure
- CSP report-only headers
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Rate limiting on POST endpoints (10/min per IP)
- Self-hosted Tailwind CSS (no CDN in production)

## Accepted Risks

| Package | Issue | Status |
|---------|-------|--------|
| ecdsa 0.19.2 | No fix available (PYSEC-2026-1325) | Accepted — used by python-jose for JWT |
| cryptography 49.0.0 | Major version upgrade required (50.0.0) | Deferred — requires testing |
