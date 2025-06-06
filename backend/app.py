import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

# Koneksi database PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "db"), # Changed to 'db' as per docker-compose service name
        database=os.environ.get("DB_NAME", "restoran"),
        user=os.environ.get("DB_USER", "student"), # Changed to 'student' as per docker-compose
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

# Endpoint untuk menambahkan ulasan (Create)
@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.json
    user_name = data['user_name']
    review_text = data['review_text']
    rating = data['rating']
    
    # Pastikan rating antara 1 dan 5
    if rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO reviews (user_name, review_text, rating) VALUES (%s, %s, %s) RETURNING id;",
                (user_name, review_text, rating))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": new_id, "user_name": user_name, "review_text": review_text, "rating": rating}), 201

# Endpoint untuk mendapatkan semua ulasan (Read)
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, user_name, review_text, rating, created_at FROM reviews ORDER BY created_at DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    reviews = [{"id": row[0], "user_name": row[1], "review_text": row[2], "rating": row[3], "created_at": row[4]} for row in rows]
    return jsonify(reviews)

# Endpoint untuk menghapus ulasan (Delete)
@app.route('/api/reviews/<int:id>', methods=['DELETE'])
def delete_review(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM reviews WHERE id = %s;", (id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Review deleted successfully!"}), 200

# Menjalankan aplikasi Flask
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
