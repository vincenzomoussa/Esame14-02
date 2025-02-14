import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CercaCittà({ onSearch }) {
  /* Ho provato a creare uno stato per memorizzare il nome della città inserita dall'utente */
  const [città, setCittà] = useState("");
  /* Ho provato a creare uno stato con array vuoto per immagazzinare le ultime ricerche effettuate dall'utente, più sotto ho effettuato uno slice di questo array per mantenere soltanto le ultime 4 ricerche, più quella attuale */
  const [storicoRicerca, setStoricoRicerca] = useState([]);
  /* Qui gestisco il cambiamento dell'input inserito dall'utente per indirizzarlo verso la città ricercata */
  const handleChange = (e) => {
    setCittà(e.target.value);
  };

  /* In questa parte di codice, invece, gestisco la ricerca della città inserita, di conseguenza se la città esiste ed è stata cercata, mantiene il suo nome in memoria e all'inserimento di altre, verifica che non ci sia già nell'array creato in precedenza, in caso contrario lo aggiunge */
  const handleSearch = () => {
    onSearch(città, (result) => {
      if (result && !storicoRicerca.includes(città)) {
        setStoricoRicerca((ricercaPrecedente) => [...ricercaPrecedente.slice(-4), città]);
      }
    });
  };
  /* Qui gestisco la ricerca della posizione dell'utente, mandando latitudine e longitudine ottenuta dal browser per ottenere le informazioni metereologiche relative a quel punto della mappa*/
  const posizioneUtente = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posizione) => {
          const { latitude, longitude } = posizione.coords;
          /* Qui chiamo la funzione onSearch per effettuare la ricerca della posizione dell'utente */
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
        <button className="btn btn-secondary mb-3" onClick={posizioneUtente}>
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
