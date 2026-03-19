import { useState, useRef, useEffect } from "react";
import { MONTHS, DAYS_SHORT, today, sameDay, isBetween, formatDisplay, daysInMonth, firstDayOfMonth } from "../utils/helpers.js";

function MiniCalendar({ year, month, onMonthChange, departure, returnDate, hovered, onHover, onSelect, minDate, hideNav }) {
  const todayDate = today();
  const firstDay  = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));

  return (
    <div className="mini-cal">
      <div className="cal-header">
        {!hideNav
          ? <button className="nav-btn" onClick={() => onMonthChange(-1)}>‹</button>
          : <span />
        }
        <span className="cal-title">{MONTHS[month]} {year}</span>
        {!hideNav
          ? <button className="nav-btn" onClick={() => onMonthChange(1)}>›</button>
          : <span />
        }
      </div>
      <div className="day-labels">
        {DAYS_SHORT.map(d => <span key={d} className="day-label">{d}</span>)}
      </div>
      <div className="day-grid">
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />;
          const isPast   = date < todayDate && !sameDay(date, todayDate);
          const isMin    = minDate && date < minDate;
          const disabled = isPast || isMin;
          const isDep    = sameDay(date, departure);
          const isRet    = sameDay(date, returnDate);
          const inRange  = isBetween(date, departure, returnDate || hovered);
          const isHov    = sameDay(date, hovered);
          let cls = "day-cell";
          if (disabled) cls += " disabled";
          else {
            if (isDep)    cls += " dep";
            if (isRet)    cls += " ret";
            if (inRange)  cls += " in-range";
            if (isHov && !isDep && !isRet) cls += " hov-edge";
          }
          if (sameDay(date, todayDate)) cls += " today-dot";
          return (
            <button key={i} className={cls} disabled={disabled}
              onMouseEnter={() => !disabled && onHover && onHover(date)}
              onClick={() => !disabled && onSelect(date)}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DatePicker({ departure, returnDate, onChange, onClose }) {
  const now = today();
  const [view, setView]       = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [hovered, setHovered] = useState(null);
  const [tab, setTab]         = useState("departure");
  const ref = useRef();

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const next = {
    year:  view.month === 11 ? view.year + 1 : view.year,
    month: (view.month + 1) % 12,
  };

  function shift(d) {
    setView(v => {
      let m = v.month + d, y = v.year;
      if (m > 11) { m = 0; y++; }
      if (m < 0)  { m = 11; y--; }
      return { year: y, month: m };
    });
  }

  function handleSelect(date) {
    if (tab === "departure") {
      onChange({ departure: date, returnDate: returnDate && returnDate <= date ? null : returnDate });
      setTab("return");
    } else {
      if (date <= departure) {
        onChange({ departure: date, returnDate: null });
        setTab("return");
      } else {
        onChange({ departure, returnDate: date });
        setTab("departure");
        setTimeout(onClose, 150);
      }
    }
  }

  return (
    <div className="picker-overlay">
      <div className="picker-box" ref={ref}>
        <div className="picker-tabs">
          <button className={`ptab${tab==="departure"?" active":""}`} onClick={() => setTab("departure")}>
            ✈ Departure
          </button>
          <button className={`ptab${tab==="return"?" active":""}`} onClick={() => setTab("return")}>
            ✈ Return
          </button>
        </div>
        <div className="picker-cals">
          <button className="cal-nav-btn left" onClick={() => shift(-1)}>‹</button>
          <MiniCalendar {...view}
            departure={departure} returnDate={returnDate}
            hovered={tab==="return" ? hovered : null}
            onHover={setHovered} onSelect={handleSelect}
            minDate={tab==="return" ? departure : null}
            onMonthChange={shift} hideNav />
          <div className="cal-sep" />
          <MiniCalendar year={next.year} month={next.month}
            departure={departure} returnDate={returnDate}
            hovered={tab==="return" ? hovered : null}
            onHover={setHovered} onSelect={handleSelect}
            minDate={tab==="return" ? departure : null}
            onMonthChange={shift} hideNav />
          <button className="cal-nav-btn right" onClick={() => shift(1)}>›</button>
        </div>
        <div className="picker-footer">
          <button className="btn-clear" onClick={() => { onChange({ departure: null, returnDate: null }); setTab("departure"); }}>
            Clear
          </button>
          <div className="picker-hint">
            {tab === "departure" ? "Select departure date" : "Now select return date"}
          </div>
          <button className="btn-done" onClick={onClose}>Done ✓</button>
        </div>
      </div>
    </div>
  );
}
