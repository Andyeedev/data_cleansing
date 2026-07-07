docker ps
CONTAINER ID   IMAGE                            COMMAND                  CREATED        STATUS          PORTS                                         NAMES
57be45832522   docker-engine                    "uvicorn app.api.mai…"   3 hours ago    Up 25 minutes   0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp   docker-engine-1
af87655a7521   postgres:15                      "docker-entrypoint.s…"   2 days ago     Up 25 minutes   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   docker-postgres-1
ae3fa6cf8477   docker.n8n.io/n8nio/n8n:latest   "tini -- /docker-ent…"   8 months ago   Up 58 minutes   0.0.0.0:5678->5678/tcp, [::]:5678->5678/tcp   n8n-compose-n8n-1
36c9658481a0   postgres:15                      "docker-entrypoint.s…"   8 months ago   Up 58 minutes   5432/tcp     