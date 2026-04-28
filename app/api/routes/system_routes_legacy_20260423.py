from fastapi import APIRouter
from app.db.connection import get_db_connection

router = APIRouter()


@router.get("/")
def list_systems_current():

    conn = get_db_connection()

    with conn.cursor() as cur:
        cur.execute("SELECT system_id, system_name, system_role FROM core.system_registry")
        rows = cur.fetchall()

    return [
        {
            "system_id": r[0],
            "system_name": r[1],
            "system_role": r[2]
        }
        for r in rows
    ]


@router.get("/")
def list_systems():
    db = get_db_connection()

    rows = db.execute("""
        SELECT system_id, system_name, system_role
        FROM core.system_registry
    """)

    return [
        {
            "system_id": r[0],
            "system_name": r[1],
            "system_role": r[2]
        }
        for r in rows
    ]

@router.get("/")
def test_route():
    return {"status": "API WORKING"}

#@router.get("/")
#def list_systems():
#    try:
#        from app.db.connection import get_db_connection##

#        conn = get_db_connection()
#        print("CONNECTION:", conn)

#        with conn.cursor() as cur:
#            cur.execute("SELECT system_id, system_name, system_role FROM core.system_registry")
#            rows = cur.fetchall()
#        return rows

#    except Exception as e:
#        import traceback
#        traceback.print_exc()
#        return {"error": str(e)}