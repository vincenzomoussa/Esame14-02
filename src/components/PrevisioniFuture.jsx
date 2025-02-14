import "bootstrap/dist/css/bootstrap.min.css";

function PrevisioniFuture({ previsioniFuture }) {
  if (!previsioniFuture || previsioniFuture.length === 0) return null;

  return (
    <>
      <br></br>
      <div className="opaco border border-black rounded text-black text-center py-4">
        <h2>Previsioni meteo dei prossimi giorni:</h2>
      </div>
      <div className="container mt-4">
        <div className="row">
          {previsioniFuture.map((meteo, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card opaco1  border border-black custom-shadow custom-hover text-dark">
                <div className="card-body text-center">
                  <h3 className="card-title">{new Date(meteo.date).toLocaleDateString()}</h3>
                  <h4 className="card-text">Stato: {meteo.description}</h4>
                  <img
                    src={`https://openweathermap.org/img/wn/${meteo.icon}@2x.png`}
                    alt="Weather icon"
                    className="mb-2 w-25"
                  />
                  <h4 className="card-text">Temperatura: {meteo.temp}°C</h4>
                  <h4 className="card-text">Vento: {meteo.wind} m/s</h4>
                  <h4 className="card-text">Umidità: {meteo.humidity}%</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PrevisioniFuture;
