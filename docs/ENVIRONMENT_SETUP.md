1️⃣ Install

Python 3.11+

Docker Desktop

VSCode

2️⃣ Create Virtual Environment

Inside project root:

python -m venv .venv


Activate:

Mac/Linux:

source .venv/bin/activate


Windows:

.venv\Scripts\activate

3️⃣ requirements.txt
psycopg2-binary
python-dotenv
pytest
reportlab


Install:

pip install -r requirements.txt

4️⃣ Docker Compose

📁 docker/docker-compose.yml

version: '3.9'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: engine
      POSTGRES_PASSWORD: engine
      POSTGRES_DB: migration_engine
    ports:
      - "5432:5432"


Start:

docker compose up -d

5️⃣ Create Schema

Connect to DB:

psql -U engine -d migration_engine


Run:

\i sql/schema/01_engine_schema.sql