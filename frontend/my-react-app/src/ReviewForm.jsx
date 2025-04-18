import { useState } from "react";

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

export default ReviewForm;
