import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

// Formulir untuk menambahkan ulasan
const ReviewForm = ({ onAddReview }) => {
  const [userName, setUserName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = { user_name: userName, review_text: reviewText, rating };
    onAddReview(review);
    setUserName("");
    setReviewText("");
    setRating(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Nama Anda"
        required
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Ulasan Anda"
        required
      />
      <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} required>
        {[1, 2, 3, 4, 5].map((star) => (
          <option key={star} value={star}>
            {star} Bintang
          </option>
        ))}
      </select>
      <button type="submit">Kirim Ulasan</button>
    </form>
  );
};

// Menampilkan daftar ulasan
const ReviewList = ({ reviews }) => {
  return (
    <div>
      <h2>Ulasan</h2>
      {reviews.length === 0 ? (
        <p>Belum ada ulasan.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id || `review-${Date.now()}-${Math.random()}`}>
              <p><strong>{review.user_name}</strong> - {review.rating} Bintang</p>
              <p>{review.review_text}</p>
              <p><em>{new Date(review.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Formulir untuk melakukan reservasi
const ReservationForm = ({ onAddReservation, onClose }) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState(new Date());
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format waktu lokal ke "yyyy-MM-dd HH:mm"
    const pad = (num) => num.toString().padStart(2, '0');
    const year = time.getFullYear();
    const month = pad(time.getMonth() + 1);
    const day = pad(time.getDate());
    const hours = pad(time.getHours());
    const minutes = pad(time.getMinutes());
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    const reservation = { name, time: formattedTime, table_number: tableNumber };
    console.log("Waktu input:", formattedTime); // Debug
    onAddReservation(reservation);
    setName("");
    setTime(new Date());
    setTableNumber("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Anda"
        required
      />
      <DatePicker
        selected={time}
        onChange={(date) => setTime(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        minDate={new Date()}
        required
      />
      <input
        type="number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        placeholder="Nomor Meja"
        required
      />
      <button type="submit">Pesan Meja</button>
    </form>
  );
};

// Menampilkan daftar reservasi
const ReservationList = ({ reservations }) => {
  return (
    <div>
      <h2>Reservasi</h2>
      {reservations.length === 0 ? (
        <p>Belum ada reservasi.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Nomor Meja</th>
              <th>Waktu</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id || `reservation-${Date.now()}-${Math.random()}`}>
                <td>{reservation.name}</td>
                <td>{reservation.table_number}</td>
                <td>{reservation.time}</td>
                <td>{reservation.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="modal-close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

// Komponen utama
const App = () => {
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([
    { name: "Americano", price: "Rp.18.000", imageUrl: "/images/americano.jpeg" },
    { name: "Aren Latte", price: "Rp.23.000", imageUrl: "/images/aren.jpeg" },
    { name: "Mango Splash", price: "Rp.25.000", imageUrl: "/images/mango.jpeg" },
    { name: "Nasi Goreng", price: "Rp.35.000", imageUrl: "/images/nasgor.jpeg" },
    { name: "Iga Bakar", price: "Rp.70.000", imageUrl: "/images/iga.jpeg" },
    { name: "Mix Platter", price: "Rp.35.000", imageUrl: "/images/mix.jpeg" },
  ]);
  const [galleryImages, setGalleryImages] = useState([
    { src: "/images/cafe.jpeg", alt: "Interior Kafe" },
    { src: "/images/cafe2.jpeg", alt: "Suasana Kafe" },
    { src: "/images/kopi.jpeg", alt: "Kopi Americano" },
    { src: "/images/nasgor2.jpeg", alt: "Nasi Goreng" },
    { src: "/images/mix.jpeg", alt: "Mix Platter" },
    { src: "/images/aren.jpeg", alt: "Aren Latte" },
  ]);

  // Mengambil data ulasan dari API
  useEffect(() => {
    fetch("http://localhost:5000/api/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(data));
  }, []);

  // Menambahkan ulasan baru
  const handleAddReview = (review) => {
    fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
      .then((response) => response.json())
      .then((newReview) => {
        const reviewWithTimestamp = { ...newReview, created_at: new Date().toISOString() };
        setReviews([reviewWithTimestamp, ...reviews]);
      });
  };

  // Mengambil data reservasi dari API
  useEffect(() => {
    fetch("http://localhost:5000/api/reservations")
      .then((response) => response.json())
      .then((data) => setReservations(data));
  }, []);

  // Menambahkan reservasi baru
  const handleAddReservation = (reservation, closeModal) => {
    console.log("Dikirim ke backend:", reservation.time);
    fetch("http://localhost:5000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
      .then((response) => response.json())
      .then((newReservation) => {
        console.log("Diterima dari backend:", newReservation.time);
        setReservations([newReservation, ...reservations]);
        closeModal(); // Tutup modal setelah reservasi berhasil
        setIsSweetAlertActive(true); // Set true before showing SweetAlert
        Swal.fire({
          title: 'Reservasi Berhasil!',
          html: `Terima kasih, <strong>${newReservation.name}</strong>!<br>Meja nomor <strong>${newReservation.table_number}</strong> dipesan untuk <strong>${newReservation.time}</strong>.`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html-container',
            confirmButton: 'swal-custom-confirm-button'
          },
          allowOutsideClick: false, // Mencegah klik di luar menutup SweetAlert
          allowEscapeKey: false, // Mencegah tombol escape menutup SweetAlert
        }).then(() => {
          setIsSweetAlertActive(false); // Set false after SweetAlert closes
        });
      })
      .catch((error) => {
        console.error("Error saat reservasi:", error);
        setIsSweetAlertActive(true); // Set true before showing SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Gagal membuat reservasi. Silakan coba lagi.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          setIsSweetAlertActive(false); // Set false after SweetAlert closes
        });
      });
  };

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSweetAlertActive, setIsSweetAlertActive] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">SEKALA</div>
        <nav className="nav-bar">
          <a href="#featured-items">Menu Unggulan</a>
          <a href="#our-story">Cerita Kami</a>
          <a href="#reviews">Ulasan</a>
          <a href="#reservations">Reservasi</a>
          <a href="#gallery">Galeri</a> {/* New navigation link */}
          <a href="#team">Tim</a>
          <a href="#location">Lokasi</a>
          <a href="#contact">Kontak</a> {/* New navigation link */}
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>SEKALA</h1>
          <h2>Coffee and Eatery</h2>
          {/* <p>KORBAN KORBAN YP</p> */}
        </div>
      </section>

      <section className="popular-items-section">
        <h2>Menu Populer</h2>
        <div className="popular-items-grid">
          <div className="popular-item-card">
            <img src="/images/burger.jpeg" alt="Burger" className="popular-item-image" /> {/* Placeholder */}
            <h3>Burger</h3>
            <p>20+ variasi</p>
          </div>
          <div className="popular-item-card">
            <img src="/images/kentang.jpeg" alt="Kentang Goreng" className="popular-item-image" /> {/* Placeholder */}
            <h3>Kentang Goreng</h3>
            <p>Crispy dan lezat</p>
          </div>
          <div className="popular-item-card">
            <img src="/images/dessert.jpeg" alt="Dessert" className="popular-item-image" /> {/* Placeholder */}
            <h3>Dessert</h3>
            <p>Manjakan diri dengan manis</p>
          </div>
        </div>
      </section>

      <section id="featured-items" className="featured-items-section">
        <h2>Menu Unggulan</h2>
        <p>Hidangan menggoda untuk Anda</p>
        <div className="items-grid">
          {featuredItems.map((item, index) => (
            <div className="item-card" key={index}>
              <img src={item.imageUrl} alt={item.name} className="item-image-actual" />
              <h3>{item.name}</h3>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <h2>Galeri Kami</h2>
        <p>Jelajahi suasana dan hidangan terbaik kami.</p>
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div className="gallery-item" key={index}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </section>

      <section id="our-story" className="our-story-section">
        <h2>Cerita Kami</h2>
        <p>Temukan perjalanan Foodie Delight</p>
        <div className="story-cards">
          <div className="story-card">
            <img src="/images/barista.jpeg" alt="Dari Peternakan ke Piring" className="story-image" />
            <h3>Dari Kami</h3>
            <p>Kami berkomitmen untuk menyajikan hidangan terbaik dengan bahan-bahan paling segar, langsung dari sumbernya. Setiap bahan dipilih dengan cermat untuk memastikan kualitas dan rasa yang tak tertandingi.</p>
          </div>
          <div className="story-card">
            <img src="/images/pelanggan.jpeg" alt="Kepuasan Pelanggan" className="story-image" />
            <h3>Kepuasan Pelanggan</h3>
            <p>Kepuasan Anda adalah inti dari segala yang kami lakukan. Kami berdedikasi untuk menciptakan pengalaman bersantap yang tak terlupakan, dari hidangan lezat hingga pelayanan yang ramah dan profesional.</p>
          </div>
        </div>
      </section>

      <section id="reviews" className="customer-reviews-section">
        <h2>Ulasan Pelanggan</h2>
        <p>Lihat apa kata pelanggan kami</p>
        <div className="reviews-slider-container">
          {reviews.length === 0 ? (
            <p>Belum ada ulasan.</p>
          ) : (
            <Slider
              dots={true}
              infinite={reviews.length > 3}
              speed={500}
              slidesToShow={reviews.length > 3 ? 3 : reviews.length}
              slidesToScroll={1}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: reviews.length > 2 ? 2 : reviews.length,
                    slidesToScroll: 1,
                    infinite: reviews.length > 2,
                    dots: true
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: reviews.length > 1,
                    dots: true
                  }
                }
              ]}
            >
              {reviews.map((review) => (
                <div className="review-card" key={review.id || `review-${Date.now()}-${Math.random()}`}>
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">👤</div>
                    <p><strong>{review.user_name}</strong></p>
                    <div className="stars">{'⭐'.repeat(review.rating)}</div>
                  </div>
                  <p>{review.review_text}</p>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      <section id="reservations" className="customer-reservations-section">
        <h2>Reservasi Pelanggan</h2>
        <p>Lihat meja yang telah dipesan</p>
        <div className="reservations-table-container">
          <ReservationList reservations={reservations} />
        </div>
        {showReservationModal || isSweetAlertActive ? null : (
          <div className="reservation-button-wrapper">
            <div className="add-button" role="button" onClick={() => setShowReservationModal(true)}>Pesan Meja</div>
          </div>
        )}
      </section>

      <section className="reservations-reviews-section">
        <div className="reviews-container">
          <h2>Ulasan</h2>
          <button className="add-button" onClick={() => setShowReviewModal(true)}>Berikan Ulasan</button>
        </div>
      </section>

      {showReservationModal && (
        <Modal onClose={() => setShowReservationModal(false)}>
          <h2>Pesan Meja</h2>
          <ReservationForm
            onAddReservation={(res) => handleAddReservation(res, () => setShowReservationModal(false))}
            onClose={() => setShowReservationModal(false)}
          />
        </Modal>
      )}

      {showReviewModal && (
        <Modal onClose={() => setShowReviewModal(false)}>
          <h2>Berikan Ulasan</h2>
          <ReviewForm onAddReview={(rev) => {
            handleAddReview(rev);
            setShowReviewModal(false);
          }} />
        </Modal>
      )}

      {showScrollToTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}

      <section id="team" className="team-section">
        <h2>Tim Kami</h2>
        <p>Kenali orang-orang di balik pengalaman kopi dan makanan Anda.</p>
        <div className="team-members-grid"> {/* Changed to grid for multiple members */}
          <div className="team-member-card">
            <img src="/images/mamat.jpg" alt="Rahmatullah - Barista & Manajer Kafe" className="member-image" /> {/* Placeholder */}
            <div className="member-details">
              <h3>Rahmatullah</h3>
              <p className="role">Manajer Kafe</p>
              <p>Memastikan setiap aspek kafe berjalan lancar dan menyenangkan.</p>
            </div>
          </div>
          <div className="team-member-card">
            <img src="/images/dapa.jpg" alt="Daffa - Barista" className="member-image" /> {/* Placeholder */}
            <div className="member-details">
              <h3>Daffa</h3>
              <p className="role">Barista</p>
              <p>Meracik kopi dengan passion untuk pengalaman rasa yang sempurna.</p>
            </div>
          </div>
          <div className="team-member-card">
            <img src="/images/jidan.jpg" alt="Zidane - Kitchen" className="member-image" /> {/* Placeholder */}
            <div className="member-details">
              <h3>Zidane</h3>
              <p className="role">Koki</p>
              <p>Menciptakan hidangan lezat yang memanjakan lidah Anda.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="location-section">
        <div className="map-placeholder">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.876718127337!2d116.8596657!3d-1.2448108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df1476ac71ed323%3A0x7c0d69304fdee271!2sLexa%20Coffee%20Balikpapan!5e0!3m2!1sen!2sid!4v1749197477048!5m2!1sen!2sid"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Hubungi Kami</h2>
        <p>Kami siap melayani Anda. Jangan ragu untuk menghubungi kami!</p>
        <div className="contact-info-grid">
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Telepon</h3>
            <p>+62 852-0000-1111</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>Email</h3>
            <p>isekalacafe@gmail.com</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">⏰</div>
            <h3>Jam Buka</h3>
            <p>Senin - Jumat: 08:00 - 22:00</p>
            <p>Sabtu - Minggu: 09:00 - 23:00</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Mamat. Hak cipta dilindungi.</p>
        <p>Kebijakan Privasi</p>
      </footer>
    </div>
  );
};

export default App;
