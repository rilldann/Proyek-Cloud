FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# Copy the migration script and SQL file
COPY migrate_db.py /app/migrate_db.py
COPY db/init.sql /app/db/init.sql
COPY . .
EXPOSE 5000
# Run migration first, then start the Flask app
CMD ["sh", "-c", "python migrate_db.py && gunicorn -w 4 -b 0.0.0.0:$PORT app:app"]