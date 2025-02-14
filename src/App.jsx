import { useState } from "react";
import CercaCittà from "./components/CercaCittà";
import MeteoOdierno from "./components/MeteoOdierno";
import PrevisioniFuture from "./components/PrevisioniFuture";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  /* Memorizzo i dati relativi al meteo odierno */
  const [meteoOdierno, setMeteoOdierno] = useState(null);
  /* Memorizzo i dati relativi al meteo dei prossimi giorni */
  const [prossimePrevisioni, setProssimePrevisioni] = useState([]);
  /* Ho cercato di memorizzare le ultime ricerche effettuate dall'utente, ma senza successo */
  const [cittàRicercate, setCittàRicercate] = useState([]);

  const keyApi = "1eebe0df7fe4b14db8418a0012179a11";

  const ricercaMeteo = (searchQuery, onSuccess) => {
    /* Se viene fornita una stringa dall'utente nella barra di ricerca, probabilmente sarà il nome di una città, questa funzione ne ricava latitudine e longitudine che serviranno a ottenere le previsioni meteo di quella città */
    if (typeof searchQuery === "string") {
      const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${keyApi}`;
      fetch(URL)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const { lat, lon, name } = data[0];
            dettagliMeteo(name, lat, lon, onSuccess);
          } else {
            alert("Città non trovata.");
          }
        });
      /* Se invece di una stringa viene passato un "oggetto" significa che l'utente ha cercato le previsioni del meteo in base alla sua posizione geografica */
    } else if (typeof searchQuery === "object" && searchQuery.latitude && searchQuery.longitude) {
      const inv_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${searchQuery.latitude}&lon=${searchQuery.longitude}&limit=1&appid=${keyApi}`;
      fetch(inv_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const { name } = data[0];
            dettagliMeteo(name, searchQuery.latitude, searchQuery.longitude, onSuccess);
          } else {
            dettagliMeteo("Posizione sconosciuta", searchQuery.latitude, searchQuery.longitude);
          }
        });
    }
  };

  const dettagliMeteo = (nomeCittà, lat, lon, onSuccess) => {
    const urlApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyApi}&units=metric&lang=it`;

    fetch(urlApi)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.list) {
          const current = data.list[0];
          /* Estrapolo i dati relativi al meteo odierno */
          setMeteoOdierno({
            city: nomeCittà,
            temp: current.main.temp.toFixed(1),
            wind: current.wind.speed.toFixed(1),
            humidity: current.main.humidity,
            description: current.weather[0].description,
            icon: current.weather[0].icon,
            date: current.dt_txt,
          });

          const previsioneProssimiGiorni = data.list
            //filtro i risultati delle previsioni dei prossimi giorni, perchè l'api mi fornisce delle previsioni con un ciclo di 3 ore, quindi, dividendo per 8, con resto 0, otterrò una previsione al giorno per 5 giorni.
            .filter((item, index) => index % 8 === 0)
            .map((item) => ({
              temp: item.main.temp.toFixed(1),
              wind: item.wind.speed.toFixed(1),
              humidity: item.main.humidity,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              date: item.dt_txt,
            }));

          setProssimePrevisioni(previsioneProssimiGiorni);
          if (onSuccess) {
            onSuccess(nomeCittà);
          }
        }
      });
  };

  return (
    <div className="App">
      <img
        src="https://weatherman.gorgias.help/cdn-cgi/image/quality=100,width=3840/https://attachments.gorgias.help/1QNmd2YbmyK79XA0/hc/RdOkb7oayO6VXGNr/2024061817-fec33e9b-fa08-4abd-a56f-f4b809812275-weatherman%20branding%20secondary%20logo%20color%201%20copy@5x.png"
        alt="Weatherman"
      />
      <div className="container">
        <CercaCittà
          onSearch={(query) =>
            ricercaMeteo(query, (nomeCittà) => {
              if (!cittàRicercate.includes(nomeCittà)) {
                setCittàRicercate([...cittàRicercate, nomeCittà]);
              }
            })
          }
        />
        <div>
          <MeteoOdierno meteo={meteoOdierno} />
          <PrevisioniFuture previsioniFuture={prossimePrevisioni} />
        </div>
      </div>
    </div>
  );
}

export default App;
