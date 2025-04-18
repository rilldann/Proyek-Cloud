import { useState, useEffect } from "react";

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
            <li key={review.id}>
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
            <li key={reservation.id}>
              <p><strong>{reservation.name}</strong> - {reservation.time}</p>
              <p>Table Number: {reservation.table_number}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Komponen utama untuk mengelola ulasan dan reservasi
const App = () => {
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);

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
      .then((newReview) => setReviews([newReview, ...reviews]));
  };

  // Mengambil data reservasi dari API
  useEffect(() => {
    fetch("http://localhost:5000/api/reservations")
      .then((response) => response.json())
      .then((data) => setReservations(data));
  }, []);

  // Menambahkan reservasi baru
  const handleAddReservation = (reservation) => {
    fetch("http://localhost:5000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
      .then((response) => response.json())
      .then((newReservation) => setReservations([newReservation, ...reservations]));
  };

  return (
    <div>
      <h1>Cafe Reservations & Reviews</h1>
      <h2>Book a Table</h2>
      <ReservationForm onAddReservation={handleAddReservation} />
      <ReservationList reservations={reservations} />
      
      <h2>Leave a Review</h2>
      <ReviewForm onAddReview={handleAddReview} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default App;
