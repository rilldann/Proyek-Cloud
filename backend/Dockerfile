FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# Salin file migrate_db.py ke dalam container
COPY migrate_db.py /app/migrate_db.py
COPY db/init.sql /app/db/init.sql
COPY . .
EXPOSE 5000
CMD ["python","migrate_db.py", "app.py"]