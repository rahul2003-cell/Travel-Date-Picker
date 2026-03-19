import { useState, useCallback } from "react";
import DatePicker from "../components/DatePicker.jsx";
import { formatDisplay, nightsBetween } from "../utils/helpers.js";

const POPULAR = [
  { from:"Mumbai", to:"Delhi",     emoji:"🏛️" },
  { from:"Delhi",  to:"Dubai",     emoji:"🏙️" },
  { from:"Mumbai", to:"Singapore", emoji:"🦁" },
  { from:"Mumbai", to:"London",    emoji:"🎡" },
];

export default function HomePage({ onSearch }) {
  const [origin,      setOrigin]      = useState("");
  const [destination, setDestination] = useState("");
  const [departure,   setDeparture]   = useState(null);
  const [returnDate,  setReturnDate]  = useState(null);
  const [pickerOpen,  setPickerOpen]  = useState(false);
  const [tripType,    setTripType]    = useState("roundtrip");
  const [touched,     setTouched]     = useState(false);

  const handleDates = useCallback(({ departure: d, returnDate: r }) => {
    setDeparture(d);
    setReturnDate(tripType === "oneway" ? null : r);
  }, [tripType]);

  const error = departure && returnDate && returnDate <= departure
    ? "Return date must be after departure" : null;

  const canSearch = origin.trim() && destination.trim() && departure &&
    (tripType === "oneway" || returnDate) && !error;

  function handleSearch() {
    setTouched(true);
    if (!canSearch) return;
    onSearch({ origin: origin.trim(), destination: destination.trim(), departure, returnDate: tripType === "oneway" ? null : returnDate });
  }

  function applyPopular(p) {
    setOrigin(p.from);
    setDestination(p.to);
  }

  const nights = nightsBetween(departure, returnDate);

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="brand-row">
            <span className="brand-icon">✈</span>
            <span className="brand-text">Skyscanner</span>
          </div>
          <h1 className="hero-title">The whole trip in<br />one smart search</h1>
          <p className="hero-sub">Compare flights from hundreds of airlines and travel sites instantly.</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-box-wrap">
        <div className="search-box">
          {/* Trip Type */}
          <div className="trip-type-row">
            {["roundtrip","oneway"].map(t => (
              <button key={t}
                className={`trip-btn${tripType===t?" active":""}`}
                onClick={() => { setTripType(t); if (t==="oneway") setReturnDate(null); }}>
                {t === "roundtrip" ? "⇄ Round trip" : "→ One way"}
              </button>
            ))}
          </div>

          {/* Route inputs */}
          <div className="route-row">
            <div className="input-wrap">
              <span className="inp-icon">🛫</span>
              <input className={`sky-input${touched && !origin.trim() ? " inp-err":""}`}
                placeholder="From — city or airport"
                value={origin}
                onChange={e => setOrigin(e.target.value)} />
              {touched && !origin.trim() && <span className="inp-err-msg">Enter origin</span>}
            </div>

            <button className="swap-btn" title="Swap"
              onClick={() => { const t=origin; setOrigin(destination); setDestination(t); }}>
              ⇄
            </button>

            <div className="input-wrap">
              <span className="inp-icon">🛬</span>
              <input className={`sky-input${touched && !destination.trim() ? " inp-err":""}`}
                placeholder="To — city or airport"
                value={destination}
                onChange={e => setDestination(e.target.value)} />
              {touched && !destination.trim() && <span className="inp-err-msg">Enter destination</span>}
            </div>
          </div>

          {/* Date row */}
          <div className="date-row">
            <div className={`date-field${pickerOpen?" open":""}${touched && !departure?" date-err":""}`}
              onClick={() => setPickerOpen(true)}>
              <span className="date-field-icon">📅</span>
              <div className="date-field-body">
                <span className="date-field-label">Departure</span>
                <span className={`date-field-val${!departure?" placeholder":""}`}>
                  {departure ? formatDisplay(departure) : "Select date"}
                </span>
              </div>
              {departure && <span className="date-check">✓</span>}
            </div>

            {tripType === "roundtrip" && (
              <div className={`date-field${pickerOpen?" open":""}${touched && !returnDate?" date-err":""}${error?" date-invalid":""}`}
                onClick={() => setPickerOpen(true)}>
                <span className="date-field-icon">📅</span>
                <div className="date-field-body">
                  <span className="date-field-label">Return</span>
                  <span className={`date-field-val${!returnDate?" placeholder":""}`}>
                    {returnDate ? formatDisplay(returnDate) : "Select date"}
                  </span>
                </div>
                {returnDate && !error && <span className="date-check">✓</span>}
              </div>
            )}
          </div>

          {/* Nights / Error */}
          {nights && !error && (
            <div className="nights-info">🌙 {nights} night{nights!==1?"s":""} trip</div>
          )}
          {error && <div className="date-error-msg">⚠️ {error}</div>}

          {/* Search button */}
          <button className="search-btn" onClick={handleSearch}>
            <span>🔍</span> Search Flights
          </button>
        </div>
      </div>

      {/* Popular routes */}
      <div className="popular-section">
        <h2 className="pop-title">Popular Routes</h2>
        <div className="pop-grid">
          {POPULAR.map((p,i) => (
            <button key={i} className="pop-card" onClick={() => applyPopular(p)}>
              <span className="pop-emoji">{p.emoji}</span>
              <div className="pop-route">{p.from} → {p.to}</div>
              <div className="pop-cta">Search flights →</div>
            </button>
          ))}
        </div>
      </div>

      {pickerOpen && (
        <DatePicker
          departure={departure}
          returnDate={returnDate}
          onChange={handleDates}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
