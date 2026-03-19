import { formatINR } from "../utils/helpers.js";

export default function FlightCard({ flight, onBook, selected, onSelect }) {
  return (
    <div className={`flight-card${selected ? " selected" : ""}`} onClick={onSelect}>
      <div className="fc-main">
        <div className="fc-airline">
          <span className="fc-logo">{flight.airline.logo}</span>
          <div>
            <div className="fc-airline-name">{flight.airline.name}</div>
            <div className="fc-num">{flight.flightNum}</div>
          </div>
        </div>

        <div className="fc-times">
          <div className="fc-time-block">
            <div className="fc-time">{flight.depTime}</div>
            <div className="fc-code">{flight.from}</div>
            <div className="fc-city">{flight.fromInfo.city}</div>
          </div>
          <div className="fc-mid">
            <div className="fc-dur">{flight.duration}</div>
            <div className="fc-line">
              <div className="fc-dot" />
              <div className="fc-dashes" />
              <span className="fc-plane-icon">✈</span>
              <div className="fc-dashes" />
              <div className="fc-dot" />
            </div>
            <div className={`fc-stops ${flight.stopCount === 0 ? "nonstop" : "stop"}`}>
              {flight.stopCount === 0 ? "Non-stop" : `${flight.stopCount} stop · ${flight.stops[0].city}`}
            </div>
          </div>
          <div className="fc-time-block right">
            <div className="fc-time">
              {flight.arrTime}
              {flight.arrNextDay && <sup className="next-day">+1</sup>}
            </div>
            <div className="fc-code">{flight.to}</div>
            <div className="fc-city">{flight.toInfo.city}</div>
          </div>
        </div>

        <div className="fc-price-col">
          <div className="fc-price">{formatINR(flight.price)}</div>
          <div className="fc-per">per person</div>
          <button className="fc-book-btn" onClick={e => { e.stopPropagation(); onBook(flight); }}>
            Book now
          </button>
        </div>
      </div>

      {selected && (
        <div className="fc-details">
          <div className="fc-detail-grid">
            <div className="fc-detail-item">
              <span className="fdi-label">Baggage</span>
              <span className="fdi-val">🧳 {flight.baggage} check-in</span>
            </div>
            <div className="fc-detail-item">
              <span className="fdi-label">Cabin</span>
              <span className="fdi-val">💺 {flight.cabin}</span>
            </div>
            <div className="fc-detail-item">
              <span className="fdi-label">Refundable</span>
              <span className="fdi-val">{flight.refundable ? "✅ Yes" : "❌ No"}</span>
            </div>
            <div className="fc-detail-item">
              <span className="fdi-label">Seats left</span>
              <span className={`fdi-val ${flight.seatsLeft <= 3 ? "urgent" : ""}`}>
                {flight.seatsLeft <= 3 ? "🔥" : "✈"} {flight.seatsLeft} seats
              </span>
            </div>
            {flight.stops.length > 0 && (
              <div className="fc-detail-item full">
                <span className="fdi-label">Layover</span>
                <span className="fdi-val">🕐 {flight.stops[0].city} · {flight.stops[0].layover}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
