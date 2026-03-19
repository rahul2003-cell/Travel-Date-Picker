import { useState, useMemo } from "react";
import FlightCard from "../components/FlightCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { formatDisplay, formatINR, nightsBetween } from "../utils/helpers.js";

export default function ResultsPage({ searchData, flights, onBack }) {
  const { origin, destination, departure, returnDate } = searchData;
  const [sortBy,       setSortBy]       = useState("price");
  const [filterStop,   setFilterStop]   = useState("all");
  const [filterMaxP,   setFilterMaxP]   = useState(Infinity);
  const [selectedOut,  setSelectedOut]  = useState(null);
  const [selectedRet,  setSelectedRet]  = useState(null);
  const [bookingFlight,setBookingFlight]= useState(null);
  const [loading,      setLoading]      = useState(false);
  const [activeTab,    setActiveTab]    = useState("outbound"); // "outbound" | "return"
  const [expandedId,   setExpandedId]   = useState(null);

  const nights = nightsBetween(departure, returnDate);

  // Filter + sort outbound
  const outbound = useMemo(() => {
    let list = [...(flights.outbound || [])];
    if (filterStop !== "all") list = list.filter(f => filterStop === "nonstop" ? f.stopCount === 0 : f.stopCount > 0);
    if (filterMaxP !== Infinity) list = list.filter(f => f.price <= filterMaxP);
    if (sortBy === "price")    list.sort((a,b) => a.price - b.price);
    if (sortBy === "duration") list.sort((a,b) => a.durationMins - b.durationMins);
    if (sortBy === "dep")      list.sort((a,b) => a.depTime.localeCompare(b.depTime));
    return list;
  }, [flights.outbound, filterStop, filterMaxP, sortBy]);

  const inbound = useMemo(() => {
    let list = [...(flights.inbound || [])];
    if (filterStop !== "all") list = list.filter(f => filterStop === "nonstop" ? f.stopCount === 0 : f.stopCount > 0);
    if (sortBy === "price")    list.sort((a,b) => a.price - b.price);
    if (sortBy === "duration") list.sort((a,b) => a.durationMins - b.durationMins);
    return list;
  }, [flights.inbound, filterStop, sortBy]);

  const minPrice = Math.min(...(flights.outbound||[]).map(f=>f.price), Infinity);
  const maxPrice = Math.max(...(flights.outbound||[]).map(f=>f.price), 0);

  function handleBook(flight) {
    setBookingFlight(flight);
  }

  function handleConfirmBooking() {
    setBookingFlight(null);
  }

  const displayList = activeTab === "outbound" ? outbound : inbound;

  return (
    <div className="results-page">
      {/* Top Bar */}
      <div className="results-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="results-route">
          <span className="rr-cities">{origin} → {destination}</span>
          {returnDate && <span className="rr-sep">|</span>}
          <span className="rr-dates">{formatDisplay(departure)}</span>
          {returnDate && <><span className="rr-arrow">⇄</span><span className="rr-dates">{formatDisplay(returnDate)}</span></>}
          {nights && <span className="rr-nights">· {nights}n</span>}
        </div>
        <button className="modify-btn" onClick={onBack}>✏️ Modify</button>
      </div>

      <div className="results-layout">
        {/* Sidebar filters */}
        <aside className="filters-panel">
          <div className="filter-section">
            <h4>Sort by</h4>
            <div className="filter-options">
              {[["price","💰 Price"],["duration","⏱ Duration"],["dep","🕐 Departure"]].map(([v,l]) => (
                <button key={v} className={`filter-opt${sortBy===v?" active":""}`} onClick={() => setSortBy(v)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>Stops</h4>
            <div className="filter-options">
              {[["all","All"],["nonstop","Non-stop"],["stops","With stops"]].map(([v,l]) => (
                <button key={v} className={`filter-opt${filterStop===v?" active":""}`} onClick={() => setFilterStop(v)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>Max Price</h4>
            <div className="price-range">
              <input type="range" min={minPrice} max={maxPrice} step={500}
                value={filterMaxP === Infinity ? maxPrice : filterMaxP}
                onChange={e => setFilterMaxP(Number(e.target.value))} />
              <span className="price-val">
                {filterMaxP === Infinity ? "Any" : formatINR(filterMaxP)}
              </span>
            </div>
            <button className="clear-filter" onClick={() => setFilterMaxP(Infinity)}>Reset</button>
          </div>
        </aside>

        {/* Main results */}
        <main className="results-main">
          {/* Tabs if round trip */}
          {returnDate && (
            <div className="result-tabs">
              <button className={`rtab${activeTab==="outbound"?" active":""}`} onClick={() => setActiveTab("outbound")}>
                ✈ Outbound · {origin} → {destination}
                {selectedOut && <span className="rtab-check">✓</span>}
              </button>
              <button className={`rtab${activeTab==="return"?" active":""}`} onClick={() => setActiveTab("return")}>
                ✈ Return · {destination} → {origin}
                {selectedRet && <span className="rtab-check">✓</span>}
              </button>
            </div>
          )}

          <div className="results-count">
            {displayList.length} flight{displayList.length !== 1 ? "s" : ""} found
            {sortBy === "price" && displayList.length > 0 && (
              <span className="cheapest-badge">From {formatINR(displayList[0].price)}</span>
            )}
          </div>

          {displayList.length === 0 ? (
            <div className="no-flights">
              <div className="nf-icon">✈️</div>
              <h3>No flights match your filters</h3>
              <p>Try adjusting the filters on the left.</p>
              <button className="btn-primary" onClick={() => { setFilterStop("all"); setFilterMaxP(Infinity); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="flight-list">
              {displayList.map(flight => (
                <FlightCard key={flight.id} flight={flight}
                  selected={expandedId === flight.id}
                  onSelect={() => setExpandedId(expandedId === flight.id ? null : flight.id)}
                  onBook={() => handleBook(flight)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {bookingFlight && (
        <BookingModal
          flight={bookingFlight}
          returnFlight={activeTab === "outbound" && returnDate ? (inbound[0] || null) : null}
          onClose={() => setBookingFlight(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
