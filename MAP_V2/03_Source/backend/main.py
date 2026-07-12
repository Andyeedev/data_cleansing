from fastapi import FastAPI

app = FastAPI(
    title="MAP Nexus API",
    description="MAP Nexus™ Enterprise Platform API",
    version="2.0.0"
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
