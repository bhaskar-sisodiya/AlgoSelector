# test_connection.py
from database.database import engine

try:
    conn = engine.connect()
    print("✅ Supabase connected successfully!")
    conn.close()
except Exception as e:
    print("❌ Connection failed:", e)
