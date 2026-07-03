import os
import glob
import psycopg2
from urllib.parse import urlparse
from app.config import settings

def run_migrations():
    url = settings.DATABASE_URL
    result = urlparse(url)
    conn = psycopg2.connect(
        host=result.hostname,
        port=result.port or 5432,
        dbname=result.path.lstrip('/'),
        user=result.username,
        password=result.password,
    )
    conn.autocommit = True
    cur = conn.cursor()

    sql_dir = os.path.join(os.path.dirname(__file__), '')
    for f in sorted(glob.glob(os.path.join(sql_dir, 'V*.sql'))):
        with open(f) as fh:
            sql = fh.read()
        cur.execute(sql)
        print(f'  ✓ {os.path.basename(f)}')

    cur.close()
    conn.close()

if __name__ == '__main__':
    run_migrations()
