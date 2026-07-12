docker compose -f docker/docker-compose.yml up --build
time="2026-06-17T19:28:48+01:00" level=warning msg="C:\\Users\\devwork\\Desktop\\projects\\Financial_services_Migration_product\\ver1.4\\fs-migration-validation-engine\\docker\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
[+] Building 51.2s (16/16) FINISHED                                                                                                                                                                                        
 => [internal] load local bake definitions                                                                                                                                                                            0.4s
 => => reading from stdin 682B                                                                                                                                                                                        0.4s
 => [internal] load build definition from Dockerfile                                                                                                                                                                  0.3s
 => => transferring dockerfile: 918B                                                                                                                                                                                  0.3s
 => WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)                                                                                                                                        0.3s
 => [internal] load metadata for docker.io/library/python:3.11-slim                                                                                                                                                   2.3s
 => [internal] load .dockerignore                                                                                                                                                                                     0.0s
 => => transferring context: 160B                                                                                                                                                                                     0.0s
 => [builder 1/6] FROM docker.io/library/python:3.11-slim@sha256:ae52c5bef62a6bdd42cd1e8dffef86b9cd284bde9427da79839de7a4b983e7ca                                                                                     0.1s
 => => resolve docker.io/library/python:3.11-slim@sha256:ae52c5bef62a6bdd42cd1e8dffef86b9cd284bde9427da79839de7a4b983e7ca                                                                                             0.1s
 => [internal] load build context                                                                                                                                                                                    26.2s
 => => transferring context: 86.65MB                                                                                                                                                                                 26.1s
 => CACHED [builder 2/6] WORKDIR /app                                                                                                                                                                                 0.0s
 => CACHED [stage-1 3/5] RUN apt-get update && apt-get install -y     libpq5     && rm -rf /var/lib/apt/lists/*                                                                                                       0.0s
 => CACHED [builder 3/6] RUN apt-get update && apt-get install -y     build-essential     libpq-dev     && rm -rf /var/lib/apt/lists/*                                                                                0.0s
 => CACHED [builder 4/6] COPY requirements.txt .                                                                                                                                                                      0.0s
 => CACHED [builder 5/6] RUN python -m pip install --upgrade pip setuptools wheel                                                                                                                                     0.0s
 => CACHED [builder 6/6] RUN pip install --no-cache-dir --user -r requirements.txt                                                                                                                                    0.0s
 => CACHED [stage-1 4/5] COPY --from=builder /root/.local /root/.local                                                                                                                                                0.0s
 => [stage-1 5/5] COPY . .                                                                                                                                                                                            7.3s
 => exporting to image                                                                                                                                                                                                5.0s
 => => exporting layers                                                                                                                                                                                               3.1s
 => => exporting manifest sha256:ad23e834b8e45a9bf580d216d8c01cc951020f61aa3313e457a8428e8b7b3c9e                                                                                                                     0.0s
 => => exporting config sha256:c31b7011ae7609e1665f8117d6281ca46ae93b7117826c5c1bb1429daec87666                                                                                                                       0.0s
 => => exporting attestation manifest sha256:f6d7fd720c8a39ce5052baf879df2ef04118421892c12727fccb52a54edf43b3                                                                                                         0.1s
 => => exporting manifest list sha256:639eb7cc85797011636d75b376a4160cfd51aec759c76829345890a9b76ee59d                                                                                                                0.0s
 => => naming to docker.io/library/docker-engine:latest                                                                                                                                                               0.0s
 => => unpacking to docker.io/library/docker-engine:latest                                                                                                                                                            1.4s
 => resolving provenance for metadata file                                                                                                                                                                            0.2s
[+] Running 2/2
 ✔ docker-engine              Built                                                                                                                                                                                   0.0s 
 ✔ Container docker-engine-1  Recreated                                                                                                                                                                               9.4s 
Attaching to engine-1, postgres-1
postgres-1  | 
postgres-1  | PostgreSQL Database directory appears to contain a database; Skipping initialization
postgres-1  | 
postgres-1  | 2026-06-17 18:30:01.945 UTC [1] LOG:  starting PostgreSQL 15.14 (Debian 15.14-1.pgdg13+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
postgres-1  | 2026-06-17 18:30:01.965 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
postgres-1  | 2026-06-17 18:30:01.965 UTC [1] LOG:  listening on IPv6 address "::", port 5432
postgres-1  | 2026-06-17 18:30:01.994 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
postgres-1  | 2026-06-17 18:30:02.110 UTC [29] LOG:  database system was interrupted; last known up at 2026-06-15 11:38:55 UTC
postgres-1  | 2026-06-17 18:30:03.106 UTC [29] LOG:  database system was not properly shut down; automatic recovery in progress
postgres-1  | 2026-06-17 18:30:03.237 UTC [29] LOG:  redo starts at 0/196D090
postgres-1  | 2026-06-17 18:30:03.252 UTC [29] LOG:  invalid record length at 0/196D178: wanted 24, got 0
postgres-1  | 2026-06-17 18:30:03.281 UTC [29] LOG:  redo done at 0/196D140 system usage: CPU: user: 0.03 s, system: 0.01 s, elapsed: 0.05 s
postgres-1  | 2026-06-17 18:30:03.437 UTC [27] LOG:  checkpoint starting: end-of-recovery immediate wait
postgres-1  | 2026-06-17 18:30:03.860 UTC [27] LOG:  checkpoint complete: wrote 3 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.170 s, sync=0.027 s, total=0.447 s; sync files=2, longest=0.015 s, average=0.014 s; distance=0 kB, estimate=0 kB
postgres-1  | 2026-06-17 18:30:03.923 UTC [1] LOG:  database system is ready to accept connections
engine-1    | INFO:     Started server process [1]
engine-1    | INFO:     Waiting for application startup.
engine-1    | INFO:     Application startup complete.
engine-1    | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
