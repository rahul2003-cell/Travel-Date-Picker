import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import { generateFlights } from "./data/flights.js";

export default function App() {
  const [page,       setPage]       = useState("home");   // "home" | "results"
  const [searchData, setSearchData] = useState(null);
  const [flights,    setFlights]    = useState(null);
  const [loading,    setLoading]    = useState(false);

  function handleSearch(data) {
    setLoading(true);
    setSearchData(data);
    // Simulate network delay
    setTimeout(() => {
      const result = generateFlights(data.origin, data.destination, data.departure, data.returnDate);
      setFlights(result);
      setLoading(false);
      setPage("results");
    }, 1200);
  }

  function handleBack() {
    setPage("home");
    setFlights(null);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sky:    #0770e3;
          --sky-dk: #0557b3;
          --sky-lt: #e8f1fd;
          --teal:   #00a19c;
          --amber:  #f59e0b;
          --rose:   #ef4444;
          --green:  #10b981;
          --ink:    #0f1f3d;
          --ink2:   #3d5066;
          --mist:   #f4f7fc;
          --cloud:  #dbe6f8;
          --fog:    #8fa3bf;
          --white:  #ffffff;
          --r:      14px;
          --sh:     0 2px 24px rgba(7,112,227,.12);
          --sh-lg:  0 8px 48px rgba(7,112,227,.18);
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--mist);
          color: var(--ink);
          min-height: 100vh;
        }

        button { cursor: pointer; font-family: inherit; }
        input   { font-family: inherit; }

        /* ─── LOADING SCREEN ─────────────────────────────── */
        .loading-screen {
          position: fixed; inset: 0;
          background: linear-gradient(135deg, #0557b3, #0770e3, #0aa5a0);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 1000; gap: 20px;
        }
        .loading-plane {
          font-size: 3rem;
          animation: flyAcross 1.2s ease-in-out infinite;
        }
        .loading-text {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: .5px;
        }
        .loading-bar {
          width: 200px; height: 4px;
          background: rgba(255,255,255,.3);
          border-radius: 2px;
          overflow: hidden;
        }
        .loading-fill {
          height: 100%;
          background: #fff;
          border-radius: 2px;
          animation: loadFill 1.2s ease-in-out infinite;
        }
        @keyframes flyAcross { 0%,100%{transform:translateX(-20px) rotate(-5deg)} 50%{transform:translateX(20px) rotate(5deg)} }
        @keyframes loadFill  { 0%{width:0%} 100%{width:100%} }

        /* ─── HOME PAGE ───────────────────────────────────── */
        .home-page { min-height: 100vh; }

        .hero {
          position: relative;
          min-height: 380px;
          display: flex; align-items: flex-end;
          overflow: hidden;
          padding-bottom: 80px;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0346a0 0%, #0770e3 50%, #0aa5a0 100%);
        }
        .hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-content {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          padding: 60px 24px 0;
          width: 100%;
        }
        .brand-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
        }
        .brand-icon {
          font-size: 1.5rem;
          background: rgba(255,255,255,.2);
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-text {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -.3px;
        }
        .hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .hero-sub {
          color: rgba(255,255,255,.8);
          font-size: 1rem;
          font-weight: 400;
        }

        /* ─── SEARCH BOX ──────────────────────────────────── */
        .search-box-wrap {
          max-width: 860px;
          margin: -56px auto 0;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }
        .search-box {
          background: var(--white);
          border-radius: 20px;
          padding: 28px;
          box-shadow: var(--sh-lg);
        }
        .trip-type-row {
          display: flex; gap: 8px; margin-bottom: 20px;
        }
        .trip-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid var(--cloud);
          background: var(--mist);
          font-size: .82rem;
          font-weight: 600;
          color: var(--ink2);
          transition: all .15s;
        }
        .trip-btn.active {
          background: var(--sky);
          border-color: var(--sky);
          color: #fff;
        }
        .route-row {
          display: flex; gap: 12px; align-items: stretch;
          margin-bottom: 14px;
        }
        .input-wrap { flex: 1; position: relative; }
        .inp-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: .95rem; pointer-events: none;
        }
        .sky-input {
          width: 100%;
          padding: 14px 14px 14px 42px;
          border: 1.5px solid var(--cloud);
          border-radius: var(--r);
          font-size: .95rem;
          color: var(--ink);
          background: var(--mist);
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .sky-input::placeholder { color: var(--fog); }
        .sky-input:focus {
          border-color: var(--sky);
          box-shadow: 0 0 0 3px rgba(7,112,227,.1);
          background: #fff;
        }
        .sky-input.inp-err { border-color: var(--rose); }
        .inp-err-msg {
          position: absolute;
          bottom: -18px; left: 0;
          font-size: .72rem;
          color: var(--rose);
          font-weight: 500;
        }
        .swap-btn {
          width: 44px; height: 44px;
          align-self: center;
          flex-shrink: 0;
          background: var(--mist);
          border: 1.5px solid var(--cloud);
          border-radius: 50%;
          font-size: 1.1rem;
          color: var(--sky);
          display: flex; align-items: center; justify-content: center;
          transition: background .15s, transform .3s;
        }
        .swap-btn:hover { background: var(--cloud); transform: rotate(180deg); }

        .date-row {
          display: flex; gap: 12px; margin-top: 20px;
        }
        .date-field {
          flex: 1;
          display: flex; align-items: center; gap: 12px;
          padding: 13px 16px;
          border: 1.5px solid var(--cloud);
          border-radius: var(--r);
          background: var(--mist);
          cursor: pointer;
          transition: all .2s;
        }
        .date-field:hover, .date-field.open {
          border-color: var(--sky);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(7,112,227,.1);
        }
        .date-field.date-err  { border-color: var(--rose); }
        .date-field.date-invalid { border-color: var(--amber); }
        .date-field-icon { font-size: .9rem; }
        .date-field-body { flex: 1; min-width: 0; }
        .date-field-label {
          display: block;
          font-size: .65rem; font-weight: 700;
          color: var(--fog); text-transform: uppercase; letter-spacing: .5px;
          margin-bottom: 2px;
        }
        .date-field-val { font-size: .9rem; font-weight: 500; color: var(--ink); }
        .date-field-val.placeholder { color: var(--fog); font-weight: 400; }
        .date-check { color: var(--green); font-size: .9rem; }

        .nights-info {
          margin-top: 10px;
          font-size: .82rem;
          color: var(--sky);
          font-weight: 600;
        }
        .date-error-msg {
          margin-top: 10px;
          font-size: .82rem;
          color: var(--rose);
          font-weight: 500;
        }

        .search-btn {
          width: 100%;
          margin-top: 20px;
          padding: 16px;
          background: linear-gradient(135deg, var(--sky), var(--sky-dk));
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: var(--r);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform .15s, box-shadow .15s;
          box-shadow: 0 4px 16px rgba(7,112,227,.35);
          letter-spacing: .2px;
        }
        .search-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(7,112,227,.45); }
        .search-btn:active { transform: none; }

        /* Popular */
        .popular-section {
          max-width: 860px;
          margin: 40px auto;
          padding: 0 24px 40px;
        }
        .pop-title {
          font-family: 'Fraunces', serif;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--ink);
        }
        .pop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .pop-card {
          background: var(--white);
          border: 1.5px solid var(--cloud);
          border-radius: var(--r);
          padding: 18px 16px;
          text-align: left;
          transition: border-color .2s, box-shadow .2s, transform .2s;
          display: flex; flex-direction: column; gap: 6px;
        }
        .pop-card:hover {
          border-color: var(--sky);
          box-shadow: var(--sh);
          transform: translateY(-2px);
        }
        .pop-emoji { font-size: 1.6rem; }
        .pop-route { font-size: .9rem; font-weight: 700; color: var(--ink); }
        .pop-cta   { font-size: .78rem; color: var(--sky); font-weight: 600; }

        /* ─── DATE PICKER ─────────────────────────────────── */
        .picker-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15,31,61,.3);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn .15s ease;
        }
        .picker-box {
          background: var(--white);
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(15,31,61,.2);
          width: min(700px, 96vw);
          overflow: hidden;
          animation: scaleUp .2s cubic-bezier(.34,1.56,.64,1);
        }
        .picker-tabs {
          display: flex;
          background: var(--mist);
          border-bottom: 1px solid var(--cloud);
        }
        .ptab {
          flex: 1; padding: 14px 20px;
          background: none; border: none;
          font-size: .85rem; font-weight: 600;
          color: var(--fog);
          display: flex; align-items: center; justify-content: center; gap: 6px;
          border-bottom: 2.5px solid transparent;
          transition: color .2s, border-color .2s;
        }
        .ptab.active { color: var(--sky); border-bottom-color: var(--sky); background: var(--white); }

        .picker-cals {
          display: flex; align-items: flex-start;
          padding: 20px 16px;
          gap: 0;
          position: relative;
        }
        .cal-nav-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 34px; height: 34px;
          background: var(--mist);
          border: 1.5px solid var(--cloud);
          border-radius: 50%;
          font-size: 1.2rem;
          color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          z-index: 2;
          transition: background .15s;
        }
        .cal-nav-btn:hover { background: var(--cloud); }
        .cal-nav-btn.left  { left: 8px; }
        .cal-nav-btn.right { right: 8px; }

        .mini-cal { flex: 1; padding: 0 20px; }
        .cal-sep  { width: 1px; background: var(--cloud); margin: 0 8px; align-self: stretch; }

        .cal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .cal-title {
          font-size: .95rem; font-weight: 700; color: var(--ink);
        }
        .nav-btn {
          width: 28px; height: 28px;
          background: var(--mist); border: 1px solid var(--cloud);
          border-radius: 8px; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s;
        }
        .nav-btn:hover { background: var(--cloud); }
        .day-labels {
          display: grid; grid-template-columns: repeat(7,1fr);
          margin-bottom: 4px;
        }
        .day-label {
          text-align: center; font-size: .65rem; font-weight: 700;
          color: var(--fog); text-transform: uppercase; padding: 4px 0;
        }
        .day-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; }
        .day-cell {
          aspect-ratio: 1;
          background: none; border: none;
          border-radius: 8px;
          font-size: .82rem; font-weight: 400;
          color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          transition: background .12s, color .12s;
          position: relative;
        }
        .day-cell:hover:not(.disabled) { background: var(--cloud); }
        .day-cell.disabled { color: #ccc; cursor: not-allowed; }
        .day-cell.dep, .day-cell.ret {
          background: var(--sky) !important;
          color: #fff !important;
          font-weight: 700;
        }
        .day-cell.in-range {
          background: rgba(7,112,227,.1);
          color: var(--sky);
          border-radius: 0;
        }
        .day-cell.hov-edge {
          background: rgba(7,112,227,.2) !important;
          color: var(--sky) !important;
        }
        .day-cell.today-dot::after {
          content: '';
          position: absolute; bottom: 3px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          background: var(--sky); border-radius: 50%;
        }
        .day-cell.dep.today-dot::after, .day-cell.ret.today-dot::after { background: #fff; }

        .picker-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
          border-top: 1px solid var(--cloud);
          background: var(--mist);
        }
        .btn-clear {
          background: none; border: 1.5px solid var(--cloud);
          padding: 8px 16px; border-radius: 10px;
          font-size: .82rem; font-weight: 600; color: var(--fog);
          transition: all .15s;
        }
        .btn-clear:hover { border-color: var(--rose); color: var(--rose); }
        .picker-hint {
          font-size: .82rem; color: var(--fog); font-weight: 500;
        }
        .btn-done {
          background: var(--sky); border: none;
          padding: 8px 20px; border-radius: 10px;
          font-size: .88rem; font-weight: 700; color: #fff;
          transition: background .15s;
        }
        .btn-done:hover { background: var(--sky-dk); }

        /* ─── RESULTS PAGE ────────────────────────────────── */
        .results-page { min-height: 100vh; }

        .results-topbar {
          background: var(--sky);
          padding: 14px 24px;
          display: flex; align-items: center; gap: 16px;
          flex-wrap: wrap;
        }
        .back-btn {
          background: rgba(255,255,255,.2);
          border: 1.5px solid rgba(255,255,255,.4);
          color: #fff; padding: 8px 16px; border-radius: 10px;
          font-size: .85rem; font-weight: 600;
          transition: background .15s;
          white-space: nowrap;
        }
        .back-btn:hover { background: rgba(255,255,255,.3); }
        .results-route {
          flex: 1; display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap;
        }
        .rr-cities { color: #fff; font-size: 1rem; font-weight: 700; }
        .rr-sep    { color: rgba(255,255,255,.5); }
        .rr-dates  { color: rgba(255,255,255,.9); font-size: .88rem; }
        .rr-arrow  { color: rgba(255,255,255,.7); }
        .rr-nights { color: rgba(255,255,255,.7); font-size: .82rem; }
        .modify-btn {
          background: rgba(255,255,255,.15);
          border: 1.5px solid rgba(255,255,255,.3);
          color: #fff; padding: 8px 14px; border-radius: 10px;
          font-size: .82rem; font-weight: 600;
          white-space: nowrap;
          transition: background .15s;
        }
        .modify-btn:hover { background: rgba(255,255,255,.25); }

        .results-layout {
          display: flex; gap: 24px;
          max-width: 1100px; margin: 0 auto;
          padding: 24px;
        }

        /* Filters */
        .filters-panel {
          width: 220px; flex-shrink: 0;
          display: flex; flex-direction: column; gap: 0;
          align-self: flex-start;
          background: var(--white);
          border-radius: var(--r);
          border: 1.5px solid var(--cloud);
          overflow: hidden;
        }
        .filter-section {
          padding: 16px;
          border-bottom: 1px solid var(--cloud);
        }
        .filter-section:last-child { border-bottom: none; }
        .filter-section h4 {
          font-size: .75rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: .5px;
          color: var(--fog); margin-bottom: 10px;
        }
        .filter-options { display: flex; flex-direction: column; gap: 6px; }
        .filter-opt {
          text-align: left; padding: 8px 12px;
          background: var(--mist); border: 1.5px solid var(--cloud);
          border-radius: 10px; font-size: .83rem; font-weight: 500;
          color: var(--ink2); transition: all .15s;
        }
        .filter-opt.active {
          background: var(--sky-lt); border-color: var(--sky);
          color: var(--sky); font-weight: 700;
        }
        .filter-opt:hover:not(.active) { border-color: var(--sky); }
        .price-range { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
        .price-range input[type=range] { width: 100%; accent-color: var(--sky); }
        .price-val { font-size: .82rem; font-weight: 600; color: var(--ink); }
        .clear-filter {
          background: none; border: none;
          font-size: .75rem; color: var(--fog);
          text-decoration: underline;
          padding: 0;
        }

        /* Results main */
        .results-main { flex: 1; min-width: 0; }

        .result-tabs {
          display: flex; gap: 10px; margin-bottom: 16px;
        }
        .rtab {
          flex: 1; padding: 12px 16px;
          background: var(--white); border: 1.5px solid var(--cloud);
          border-radius: var(--r); font-size: .85rem; font-weight: 600;
          color: var(--ink2); transition: all .15s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .rtab.active { border-color: var(--sky); color: var(--sky); background: var(--sky-lt); }
        .rtab-check { color: var(--green); }

        .results-count {
          display: flex; align-items: center; gap: 12px;
          font-size: .9rem; font-weight: 600; color: var(--ink2);
          margin-bottom: 14px;
        }
        .cheapest-badge {
          background: var(--green); color: #fff;
          padding: 3px 10px; border-radius: 20px;
          font-size: .75rem; font-weight: 700;
        }

        .no-flights {
          text-align: center; padding: 60px 24px;
          background: var(--white); border-radius: var(--r);
          border: 1.5px solid var(--cloud);
        }
        .nf-icon { font-size: 3rem; margin-bottom: 16px; }
        .no-flights h3 { font-size: 1.1rem; margin-bottom: 8px; }
        .no-flights p  { color: var(--fog); margin-bottom: 20px; }

        .flight-list { display: flex; flex-direction: column; gap: 12px; }

        /* ─── FLIGHT CARD ─────────────────────────────────── */
        .flight-card {
          background: var(--white);
          border: 1.5px solid var(--cloud);
          border-radius: var(--r);
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
          cursor: pointer;
          animation: slideIn .25s ease both;
        }
        .flight-card:hover { border-color: var(--sky); box-shadow: var(--sh); }
        .flight-card.selected { border-color: var(--sky); box-shadow: 0 0 0 3px rgba(7,112,227,.12); }

        .fc-main {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 20px;
        }
        .fc-airline {
          display: flex; align-items: center; gap: 10px;
          width: 130px; flex-shrink: 0;
        }
        .fc-logo { font-size: 1.6rem; }
        .fc-airline-name { font-size: .82rem; font-weight: 700; color: var(--ink); }
        .fc-num          { font-size: .72rem; color: var(--fog); }

        .fc-times {
          flex: 1; display: flex; align-items: center; gap: 0;
        }
        .fc-time-block { text-align: center; min-width: 70px; }
        .fc-time-block.right { text-align: center; }
        .fc-time { font-size: 1.2rem; font-weight: 800; color: var(--ink); }
        .next-day { color: var(--rose); font-size: .65rem; font-weight: 700; }
        .fc-code { font-size: .72rem; font-weight: 700; color: var(--sky); letter-spacing: .5px; }
        .fc-city { font-size: .7rem; color: var(--fog); }

        .fc-mid {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 4px; padding: 0 12px;
        }
        .fc-dur { font-size: .75rem; color: var(--fog); font-weight: 600; }
        .fc-line {
          display: flex; align-items: center; gap: 2px;
          width: 100%;
        }
        .fc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cloud); flex-shrink: 0; }
        .fc-dashes { flex: 1; height: 1.5px; background: var(--cloud); }
        .fc-plane-icon { font-size: .85rem; color: var(--sky); }
        .fc-stops { font-size: .72rem; font-weight: 700; }
        .fc-stops.nonstop { color: var(--green); }
        .fc-stops.stop    { color: var(--amber); }

        .fc-price-col {
          text-align: right; flex-shrink: 0;
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
        }
        .fc-price { font-size: 1.25rem; font-weight: 800; color: var(--ink); }
        .fc-per   { font-size: .7rem; color: var(--fog); }
        .fc-book-btn {
          background: var(--sky); color: #fff;
          border: none; padding: 9px 20px; border-radius: 10px;
          font-size: .85rem; font-weight: 700;
          transition: background .15s, transform .1s;
          white-space: nowrap;
        }
        .fc-book-btn:hover { background: var(--sky-dk); transform: translateY(-1px); }

        .fc-details {
          border-top: 1px solid var(--cloud);
          padding: 14px 20px;
          background: var(--mist);
          animation: fadeSlide .2s ease;
        }
        .fc-detail-grid {
          display: flex; flex-wrap: wrap; gap: 16px;
        }
        .fc-detail-item { display: flex; flex-direction: column; gap: 2px; min-width: 100px; }
        .fc-detail-item.full { width: 100%; }
        .fdi-label { font-size: .65rem; font-weight: 800; color: var(--fog); text-transform: uppercase; letter-spacing: .5px; }
        .fdi-val   { font-size: .85rem; font-weight: 600; color: var(--ink); }
        .fdi-val.urgent { color: var(--rose); }

        /* ─── BOOKING MODAL ───────────────────────────────── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(15,31,61,.5);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn .15s ease;
        }
        .modal-box {
          background: var(--white);
          border-radius: 20px;
          width: min(560px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          position: relative;
          animation: scaleUp .2s cubic-bezier(.34,1.56,.64,1);
        }
        .modal-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px;
          background: var(--mist); border: 1.5px solid var(--cloud);
          border-radius: 50%; font-size: .9rem;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink2); transition: all .15s;
        }
        .modal-close:hover { background: var(--rose); color: #fff; border-color: var(--rose); }

        .modal-progress {
          display: flex; align-items: center; justify-content: center;
          gap: 0; position: relative; margin-bottom: 24px;
        }
        .prog-step {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; flex: 1; position: relative; z-index: 1;
        }
        .prog-circle {
          width: 32px; height: 32px;
          border-radius: 50%; border: 2px solid var(--cloud);
          background: var(--white);
          display: flex; align-items: center; justify-content: center;
          font-size: .8rem; font-weight: 700; color: var(--fog);
          transition: all .3s;
        }
        .prog-step.active  .prog-circle { border-color: var(--sky); color: var(--sky); }
        .prog-step.done    .prog-circle { background: var(--sky); border-color: var(--sky); color: #fff; }
        .prog-step span { font-size: .7rem; font-weight: 600; color: var(--fog); }
        .prog-step.active  span { color: var(--sky); }
        .prog-step.done    span { color: var(--green); }
        .prog-line {
          position: absolute; top: 16px; left: 16.5%;
          height: 2px; background: var(--sky);
          transition: width .4s ease;
          z-index: 0;
        }

        .modal-flight-summary {
          background: var(--mist); border: 1.5px solid var(--cloud);
          border-radius: var(--r); padding: 14px 16px;
          margin-bottom: 20px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .mfs-leg {
          display: flex; align-items: center; gap: 10px;
          font-size: .83rem; flex-wrap: wrap;
        }
        .mfs-tag {
          background: var(--sky); color: #fff;
          padding: 2px 8px; border-radius: 6px;
          font-size: .68rem; font-weight: 700;
          text-transform: uppercase;
        }
        .mfs-tag.return { background: var(--teal); }
        .mfs-price { margin-left: auto; font-weight: 700; color: var(--sky); }
        .mfs-total {
          text-align: right; font-size: .95rem;
          color: var(--ink); border-top: 1px solid var(--cloud);
          padding-top: 8px; margin-top: 4px;
        }

        .form-title {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem; font-weight: 700;
          color: var(--ink); margin-bottom: 16px;
        }
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
          margin-bottom: 20px;
        }
        .form-group { display: flex; flex-direction: column; gap: 5px; position: relative; }
        .form-group.full { grid-column: 1 / -1; }
        .form-group label { font-size: .75rem; font-weight: 700; color: var(--ink2); }
        .form-group input {
          padding: 11px 14px;
          border: 1.5px solid var(--cloud);
          border-radius: 10px; font-size: .9rem;
          color: var(--ink); background: var(--mist);
          outline: none; transition: all .2s;
        }
        .form-group input:focus {
          border-color: var(--sky);
          box-shadow: 0 0 0 3px rgba(7,112,227,.1);
          background: #fff;
        }
        .form-group.err input { border-color: var(--rose); }
        .form-err { font-size: .72rem; color: var(--rose); font-weight: 500; }

        .card-visual {
          background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
          border-radius: 14px; padding: 20px; margin-bottom: 18px;
          color: #fff; font-family: 'Fraunces', serif;
        }
        .cv-chip { font-size: 1.4rem; margin-bottom: 16px; opacity: .8; }
        .cv-num  { font-size: 1.1rem; letter-spacing: 3px; margin-bottom: 12px; }
        .cv-row  { display: flex; justify-content: space-between; font-size: .82rem; opacity: .8; }

        .btn-primary {
          background: linear-gradient(135deg, var(--sky), var(--sky-dk));
          color: #fff; border: none;
          padding: 14px 24px; border-radius: var(--r);
          font-size: .95rem; font-weight: 700;
          transition: transform .15s, box-shadow .15s;
          box-shadow: 0 4px 16px rgba(7,112,227,.3);
        }
        .btn-primary.full { width: 100%; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(7,112,227,.4); }

        .confirmed-view {
          text-align: center; padding: 20px 0;
        }
        .confirm-icon { font-size: 3.5rem; margin-bottom: 12px; }
        .confirmed-view h2 {
          font-family: 'Fraunces', serif;
          font-size: 1.6rem; margin-bottom: 8px; color: var(--ink);
        }
        .confirmed-view p { color: var(--fog); font-size: .9rem; }
        .booking-ref {
          font-size: 1.8rem; font-weight: 800; letter-spacing: 3px;
          color: var(--sky); margin: 12px 0;
          font-family: 'Fraunces', serif;
        }
        .confirm-sub { margin-bottom: 16px; font-size: .85rem; }
        .confirm-details {
          background: var(--mist); border: 1.5px solid var(--cloud);
          border-radius: var(--r); padding: 16px;
          display: flex; flex-direction: column; gap: 8px;
          font-size: .88rem; color: var(--ink2);
          margin-bottom: 20px; text-align: left;
        }

        /* ─── ANIMATIONS ──────────────────────────────────── */
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes scaleUp  { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlide{ from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        /* ─── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 768px) {
          .results-layout { flex-direction: column; padding: 16px; }
          .filters-panel  { width: 100%; }
          .filter-options { flex-direction: row; flex-wrap: wrap; }
          .filter-opt     { padding: 6px 10px; font-size: .78rem; }
          .route-row      { flex-wrap: wrap; }
          .swap-btn       { align-self: center; }
          .date-row       { flex-direction: column; }
          .fc-main        { flex-wrap: wrap; gap: 12px; }
          .fc-airline     { width: auto; }
          .fc-price-col   { width: 100%; flex-direction: row; align-items: center; justify-content: space-between; }
          .form-grid      { grid-template-columns: 1fr; }
          .picker-cals    { flex-direction: column; }
          .cal-sep        { width: 100%; height: 1px; margin: 8px 0; }
          .cal-nav-btn    { display: none; }
          .hero           { min-height: 280px; }
          .search-box-wrap{ margin-top: -40px; }
        }
      `}</style>

      {loading && (
        <div className="loading-screen">
          <div className="loading-plane">✈️</div>
          <div className="loading-text">Searching hundreds of airlines…</div>
          <div className="loading-bar"><div className="loading-fill" /></div>
        </div>
      )}

      {page === "home" && (
        <HomePage onSearch={handleSearch} />
      )}

      {page === "results" && flights && (
        <ResultsPage
          searchData={searchData}
          flights={flights}
          onBack={handleBack}
        />
      )}
    </>
  );
}
