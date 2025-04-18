import { useState, useEffect } from "react";

function App() {
  const [reservations, setReservations] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reservations")
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReservation = { name, time, table_number: tableNumber };
    fetch("http://localhost:5000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReservation),
    })
      .then((response) => response.json())
      .then((data) => {
        setReservations([...reservations, data]);
        setName("");
        setTime("");
        setTableNumber("");
      })
      .catch((error) => console.error("Error:", error));
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <h1>Reservasi Meja</h1>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            {reservation.name} - {reservation.time} - Meja {reservation.table_number}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
        />
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Nomor Meja"
        />
        <button type="submit">Buat Reservasi</button>
      </form>
    </div>
  );
}

export default App;
