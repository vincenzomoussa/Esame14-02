import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CercaCittà({ onSearch }) {
  const [città, setCittà] = useState("");
  const [storicoRicerca, setStoricoRicerca] = useState([]);

  const handleChange = (e) => {
    setCittà(e.target.value);
  };

  const handleSearch = () => {
    onSearch(città, (result) => {
      if (result && !storicoRicerca.includes(città)) {
        setStoricoRicerca((ricercaPrecedente) => [...ricercaPrecedente.slice(-4), città]);
      }
    });
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch({ latitude, longitude }, () => {});
        },
        (error) => {
          console.error("Errore nell'ottenere la posizione", error);
          alert("Impossibile ottenere la posizione attuale. Verifica i permessi del browser.");
        }
      );
    } else {
      console.error("Geolocalizzazione non supportata dal tuo browser.");
      alert("Il tuo browser non supporta la geolocalizzazione.");
    }
  };

  return (
    <div>
      <div className="d-flex flex-column align-items-center">
        <div className="input-group mb-3 w-75">
          <input
            type="text"
            className="form-control"
            placeholder="Inserisci il nome di una città..."
            value={città}
            onChange={handleChange}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Cerca
          </button>
        </div>
        <button className="btn btn-secondary mb-3" onClick={handleLocationSearch}>
          Utilizza la tua posizione <br />
          (Richiede autorizzazione)
        </button>
        <div className="mb-3">
          {storicoRicerca.map((item, index) => (
            <button
              key={index}
              className="btn btn-outline-secondary me-2 mb-2"
              onClick={() => onSearch(item, () => {})}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CercaCittà;
