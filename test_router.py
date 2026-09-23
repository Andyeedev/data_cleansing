import sys
from fastapi import APIRouter, FastAPI

# Test GET
r1 = APIRouter(prefix="/api/v1/public", tags=["Public"])

@r1.get("/get-test")
def get_test():
    return {"method": "get"}

a1 = FastAPI()
a1.include_router(r1)

print("Test 1 - GET:")
for route in a1.routes:
    p = getattr(route, "path", None)
    if p:
        print(f"  {p}")

# Test POST
r2 = APIRouter(prefix="/api/v1/public", tags=["Public"])

@r2.post("/post-test")
def post_test():
    return {"method": "post"}

a2 = FastAPI()
a2.include_router(r2)

print("Test 2 - POST:")
for route in a2.routes:
    p = getattr(route, "path", None)
    if p:
        print(f"  {p}")