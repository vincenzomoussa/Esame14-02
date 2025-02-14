import "bootstrap/dist/css/bootstrap.min.css";

function MeteoOdierno({ meteo }) {
  if (!meteo) return null;

  return (
    <>
      <div className="opaco border border-black rounded text-black text-center py-4 mb-3">
        <h2>Previsioni meteo del giorno:</h2>
      </div>

      <div className="container">
        <div className="border border-black text-dark pt-2 opaco1">
          <div className="details">
            <h2>
              {meteo.city} ({new Date(meteo.date).toLocaleDateString()})
            </h2>
            <h4>Temperatura: {meteo.temp}°C</h4>
            <h4>Vento: {meteo.wind} m/s</h4>
            <h4>Umidità: {meteo.humidity}%</h4>
          </div>
          <div>
            <h4>Stato: {meteo.description}</h4>
            <img src={`https://openweathermap.org/img/wn/${meteo.icon}@4x.png`} alt="Icona meteo" />
          </div>
        </div>
      </div>
    </>
  );
}

export default MeteoOdierno;
