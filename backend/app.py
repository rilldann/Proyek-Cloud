import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

# Koneksi database PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        database=os.environ.get("DB_NAME", "reserve"),
        user=os.environ.get("DB_USER", "mamat"),
        password=os.environ.get("DB_PASSWORD", "123")
    )
    return conn

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app)  # Enable CORS untuk frontend

# Endpoint untuk membuat reservasi (Create)
@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.json
    name = data['name']
    time = data['time']
    table_number = data['table_number']
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO reservations (name, time, table_number) VALUES (%s, %s, %s) RETURNING id;",
                (name, time, table_number))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"id": new_id, "name": name, "time": time, "table_number": table_number}), 201

# Endpoint untuk mendapatkan semua reservasi (Read)
@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, time, table_number, status FROM reservations;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    reservations = [{"id": row[0], "name": row[1], "time": row[2], "table_number": row[3], "status": row[4]} for row in rows]
    return jsonify(reservations)

# Endpoint untuk memperbarui reservasi (Update)
@app.route('/api/reservations/<int:id>', methods=['PUT'])
def update_reservation(id):
    data = request.json
    name = data.get('name')
    time = data.get('time')
    table_number = data.get('table_number')
    status = data.get('status')
    
    conn = get_db_connection()
    cur = conn.cursor()

    if name:
        cur.execute("UPDATE reservations SET name = %s WHERE id = %s;", (name, id))
    if time:
        cur.execute("UPDATE reservations SET time = %s WHERE id = %s;", (time, id))
    if table_number:
        cur.execute("UPDATE reservations SET table_number = %s WHERE id = %s;", (table_number, id))
    if status:
        cur.execute("UPDATE reservations SET status = %s WHERE id = %s;", (status, id))

    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"message": "Reservation updated successfully!"}), 200

# Endpoint untuk menghapus reservasi (Delete)
@app.route('/api/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM reservations WHERE id = %s;", (id,))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"message": "Reservation deleted successfully!"}), 200

# Menjalankan aplikasi Flask
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
