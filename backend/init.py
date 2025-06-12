import os
import psycopg2
from urllib.parse import urlparse

def run_migration():
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable not set")
    
    print(f"Connecting to database: {DATABASE_URL}")  # Debugging log

    # Parse the DATABASE_URL
    url = urlparse(DATABASE_URL)
    try:
        conn = psycopg2.connect(
            host=url.hostname,
            database=url.path[1:],  # Remove the leading '/'
            user=url.username,
            password=url.password,
            port=url.port
        )
        cur = conn.cursor()
        print("Connection established!")  # Debugging log

        # Read and execute schema.sql
        with open('/app/db/schema.sql', 'r') as f:
            schema = f.read()
            print(f"Executing schema: {schema[:100]}...")  # Debugging log (first 100 chars of schema)
            cur.execute(schema)
        
        conn.commit()
        print("Database migration completed!")

    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if _name_ == '_main_':
    run_migration()