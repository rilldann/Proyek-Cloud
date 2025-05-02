CREATE DATABASE IF NOT EXISTS restoran;

-- Gunakan database yang baru dibuat
\c restoran;


-- Create tables
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    table_number INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    time TIMESTAMP NOT NULL,
    table_number INT,
    status VARCHAR(20) DEFAULT 'reserved',
    FOREIGN KEY (table_number) REFERENCES tables(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    review_text TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
