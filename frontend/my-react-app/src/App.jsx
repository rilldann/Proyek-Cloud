import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from 'sweetalert2';
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
        placeholder="Your Name"
        required
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Your Review"
        required
      />
      <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} required>
        {[1, 2, 3, 4, 5].map((star) => (
          <option key={star} value={star}>
            {star} Star
          </option>
        ))}
      </select>
      <button type="submit">Submit Review</button>
    </form>
  );
};

// Menampilkan daftar ulasan
const ReviewList = ({ reviews }) => {
  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id || `review-${Date.now()}-${Math.random()}`}>
              <p><strong>{review.user_name}</strong> - {review.rating} Stars</p>
              <p>{review.review_text}</p>
              <p><em>{new Date(review.created_at).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Formulir untuk melakukan reservasi
const ReservationForm = ({ onAddReservation }) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservation = { name, time, table_number: tableNumber };
    onAddReservation(reservation);
    setName("");
    setTime("");
    setTableNumber("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
      />
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        placeholder="Table Number"
        required
      />
      <button type="submit">Book Table</button>
    </form>
  );
};

// Menampilkan daftar reservasi
const ReservationList = ({ reservations }) => {
  return (
    <div>
      <h2>Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id || `reservation-${Date.now()}-${Math.random()}`}>
              <p><strong>{reservation.name}</strong> - {reservation.time}</p>
              <p>Table Number: {reservation.table_number}</p>
            </li>
          ))}
        </ul>
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

// Komponen utama untuk mengelola ulasan dan reservasi
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

  // Mengambil data ulasan dari API
  useEffect(() => {
    fetch("http://backend:5000/api/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(data));
  }, []);

  // Menambahkan ulasan baru
  const handleAddReview = (review) => {
    fetch("http://backend:5000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
      .then((response) => response.json())
      .then((newReview) => setReviews([newReview, ...reviews]));
  };

  // Mengambil data reservasi dari API
  useEffect(() => {
    fetch("http://backend:5000/api/reservations")
      .then((response) => response.json())
      .then((data) => setReservations(data));
  }, []);

  // Menambahkan reservasi baru
  const handleAddReservation = (reservation) => {
    fetch("http://backend:5000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
      .then((response) => response.json())
      .then((newReservation) => {
        setReservations([newReservation, ...reservations]);
        Swal.fire({
          title: 'Reservation Confirmed!',
          html: `Thank you, <strong>${newReservation.name}</strong>!<br>Your table number <strong>${newReservation.table_number}</strong> is reserved for <strong>${new Date(newReservation.time).toLocaleString()}</strong>.`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html-container',
            confirmButton: 'swal-custom-confirm-button'
          }
        });
      });
  };

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
          <a href="#featured-items">Featured</a>
          <a href="#our-story">Story</a>
          <a href="#reviews">Reviews</a>
          <a href="#reservations">Reservations</a>
          <a href="#team">Team</a>
          <a href="#location">Location</a>
        </nav>
      </header>

      <section className="hero-section">
  <div className="hero-content">
    <h1>SEKALA</h1>
    <h2>Coffee and Eatery</h2>
    <p>KORBAN KORBAN YP</p>
  </div>
</section>

      <section id="featured-items" className="featured-items-section">
        <h2>Featured Items</h2>
        <p>Tempting dishes for you</p>
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

      <section id="our-story" className="our-story-section">
        <h2>Our Story</h2>
        <p>Discover the journey of Foodie Delight</p>
        <div className="story-cards">
          <div className="story-card">
            <div className="story-icon"></div>
            <h3>From Farm to Plate</h3>
            <p>We source fresh ingredients for our dishes.</p>
          </div>
          <div className="story-card">
            <div className="story-icon"></div>
            <h3>Customer Satisfaction</h3>
            <p>Your delight is our top priority.</p>
          </div>
        </div>
      </section>

      <section id="reviews" className="customer-reviews-section">
        <h2>Customer Reviews</h2>
        <p>See what our customers say</p>
        <div className="reviews-slider-container">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
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
                    <div className="reviewer-avatar">👤</div> {/* Person icon */}
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

      <section className="popular-items-section">
        <h2>Popular Items</h2>
        <div className="popular-items-grid">
          <div className="popular-item-card">
            <div className="item-icon">🍔</div>
            <h3>Burgers</h3>
            <p>20+ varieties</p>
          </div>
          <div className="popular-item-card">
            <div className="item-icon">🍟</div>
            <h3>Fries</h3>
            <p>Crispy and flavorful</p>
          </div>
          <div className="popular-item-card">
            <div className="item-icon">🍰</div>
            <h3>Desserts</h3>
            <p>Indulge in sweetness</p>
          </div>
        </div>
      </section>
      <section id="reservations" className="customer-reservations-section">
        <h2>Customer Reservations</h2>
        <p>See your booked tables</p>
        <div className="reservations-table-container">
          {reservations.length === 0 ? (
            <p>No reservations yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Table Number</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id || `reservation-${Date.now()}-${Math.random()}`}>
                    <td>{reservation.name}</td>
                    <td>{reservation.table_number}</td>
                    <td>{new Date(reservation.time).toLocaleString()}</td>
                    <td>{reservation.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button className="add-button" onClick={() => setShowReservationModal(true)}>Book a Table</button>
      </section>

      <section className="reservations-reviews-section">
        <div className="reviews-container">
          <h2>Reviews</h2>
          <button className="add-button" onClick={() => setShowReviewModal(true)}>Leave a Review</button>
        </div>
      </section>

      {showReservationModal && (
        <Modal onClose={() => setShowReservationModal(false)}>
          <h2>Book a Table</h2>
          <ReservationForm onAddReservation={(res) => {
            handleAddReservation(res);
            setShowReservationModal(false); // Close modal on submit
          }} />
        </Modal>
      )}

      {showReviewModal && (
        <Modal onClose={() => setShowReviewModal(false)}>
          <h2>Leave a Review</h2>
          <ReviewForm onAddReview={(rev) => {
            handleAddReview(rev);
            setShowReviewModal(false); // Close modal on submit
          }} />
        </Modal>
      )}

      {showScrollToTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
      <section id="team" className="team-section">
        <div className="team-member-card">
          <div className="member-avatar">☕</div> {/* Cafe icon */}
          <div className="member-details">
            <h3>Rahmatullah</h3>
            <p className="role">Barista & Cafe Manager</p>
            <p>Crafting the perfect coffee experience for you.</p>
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

      <footer className="footer">
        <p>© 2025 Mamat. All rights reserved.</p>
        <p>Privacy Policy</p>
      </footer>

      
    </div>
  );
};

export default App;
