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
  
  export default ReviewList;
  