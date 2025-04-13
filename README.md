# Proposal Proyek Cloud Kelompok 3

## Tema: Sistem Reservasi Restaurant

### 1. **🧾Deskripsi Proyek**
Proyek ini adalah pengembangan aplikasi Sistem Reservasi Restoran yang memungkinkan pelanggan melakukan pemesanan meja secara online. Aplikasi ini terdiri dari frontend (React+Vite), backend (Flask), dan database (PostgreSQL) dengan arsitektur microservices. Pengguna dapat melihat ketersediaan meja, memilih waktu reservasi, dan menerima konfirmasi. Admin restoran dapat mengelola daftar reservasi, melihat jadwal reservasi harian, dan mengatur jumlah meja yang tersedia.

### 2. **🎯 Scope dan Fitur**

a. **Pelanggan** : 
- Melihat daftar restoran dan deskripsi singkatnya
- Melihat jadwal ketersediaan meja
- Melakukan reservasi meja (nama, tanggal, waktu jumlah orang)
- Melihat status reservasi (confirmed/pending)

b. **Admin** : 
- Login sebagai admin
- Melihat semua reservasi
- Menambahkan atau mengedit jadwal meja
- Mengonfirmasi atau membatalkan reservasi

### 3. **🧑‍💻 Pembagian Tugas Tim**

| Nama Anggota | Peran               | Tugas Utama                                                                 |
|--------------|---------------------|------------------------------------------------------------------------------|
| Zidane Alfarizi    | Backend Engineer    | Membuat REST API menggunakan Flask, koneksi ke PostgreSQL, operasi CRUD     |
| Muhammad Daffa Rayhan    | Frontend Engineer   | Mengembangkan antarmuka pengguna dengan React+Vite, integrasi API           |
| Rahmatullah    | DevOps Engineer     | Menyiapkan Docker dan Docker Compose, CI/CD pipeline, deployment, monitoring|

### 4. **🗂️ Struktur Repository GitHub**
```bash
restaurant-reservation-app/
├── backend/                  # Flask API source code
│   ├── app.py                # Main Flask app
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Dockerfile for backend
├── frontend/                 # React + Vite source code
│   ├── my-react-app/         # React project directory
│   │   ├── src/
│   │   ├── public/
│   │   └── ...
│   └── Dockerfile            # Dockerfile for frontend
├── db/
│   ├── init.sql              # SQL script to initialize database
├── docker-compose.yml        # Docker Compose for running all service
├── README.md                 # Project overview and instructions
└── docs/
    ├── proposal.md           # Project proposal document
    └── wireframe.png         # UI/UX wireframe image
```

### 5. **🧱 Diagram Arsitektur Microservices**
```bash
+---------------------+          +---------------------+          +---------------------+
|     Frontend UI     | <------> |     Flask Backend    | <------>|     PostgreSQL DB   |
| (React + Vite)      |          |  (API: /reservations)|         |     (reservations,  |
|                     |          |                     |          |     tables)         |
+---------------------+          +---------------------+          +---------------------+
       |                             |                            |
       |                             |                            |
       |      Docker Container       |      Docker Container      |
       |      (react_container)      |      (flask_container)     |
```

### 6. **🖌️ Wireframe UI/UX**

[Lihat Desain di Figma](https://www.figma.com/design/MPEvcUwECI938J1iNfgrl8/Untitled?node-id=0-1&t=As6cHknzTGDXE4VQ-1)


### 7. **🗓️ Timeline Proyek**

| Pekan | Fokus Kegiatan                        | Deliverable                                                                 |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 9     | Perancangan dan Inisiasi Proyek       | - Proposal proyek (Markdown)                                                |
|       |                                        | - Wireframe UI/UX                                                           |
|       |                                        | - Struktur dasar repository GitHub                                          |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 10    | Pengembangan Layanan Backend (CRUD)   | - API CRUD reservasi menggunakan Flask                                      |
|       |                                        | - Koneksi ke database PostgreSQL                                            |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 11    | Pengembangan Frontend (Integrasi API) | - Komponen antarmuka pengguna (React + Vite)                                |
|       |                                        | - Konsumsi API Backend dengan Axios                                         |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 12    | Containerization dengan Docker         | - Dockerfile untuk backend dan frontend                                     |
|       |                                        | - docker-compose.yml                                                        |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 13    | Deployment ke Cloud Platform           | - Deployment menggunakan Render / Railway / GCP                            |
|       |                                        | - Domain / Link aplikasi                                                     |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 14    | CI/CD Pipeline dan Monitoring          | - Setup CI/CD sederhana (GitHub Actions / Railway Auto-deploy)              |
|       |                                        | - Tambahan monitoring/logging sederhana (log console atau tool ringan)      |
|-------|----------------------------------------|-----------------------------------------------------------------------------|
| 15    | Finalisasi dan Presentasi              | - Proyek final di GitHub (dengan dokumentasi)                               |
|       |                                        | - Presentasi demo proyek                                                    |


