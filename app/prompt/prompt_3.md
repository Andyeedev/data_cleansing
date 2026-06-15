
I want you to first run full project using: "python -m app.main run --config config.yaml" to get a full understanding. Then give me analysis of your findings and proposed solutions. Happy for you to tweaks my proposed solution as you feel fits.
Finally, wait for my approvapprovals, before proceeding to below solution. Happ :

 Visual Example of the Combined Result:
  This is what you will see in your terminal after the implementation:

    1 [STEP 01/06] CONNECTION RESOLUTION STARTED
    2     Resolving Source: Postgres (localhost) ... ✅
    3     Resolving Source: SQL Server (DEVWORK2) ... ✅
    4 [STEP 01/06] CONNECTION RESOLUTION COMPLETED (450ms)
    5
    6 [STEP 05/06] CONTROL EXECUTION STARTED
    7     [CONTROL C01] STARTED
    8     [CONTROL C01] PASSED (12ms)
    9     [CONTROL C02] STARTED
   10     [CONTROL C02] PASSED (85ms)
   11 [STEP 05/06] CONTROL EXECUTION COMPLETED (102ms)


   irm https://antigravity.google/cli/install.ps1 | iex