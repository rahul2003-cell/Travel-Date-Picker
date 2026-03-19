// Mock flight data generator
const AIRLINES = [
  { name: "IndiGo",         code: "6E", color: "#1a237e", logo: "🔵" },
  { name: "Air India",      code: "AI", color: "#e53935", logo: "🔴" },
  { name: "SpiceJet",       code: "SG", color: "#f57c00", logo: "🟠" },
  { name: "Vistara",        code: "UK", color: "#6a1b9a", logo: "🟣" },
  { name: "GoFirst",        code: "G8", color: "#00897b", logo: "🟢" },
  { name: "Emirates",       code: "EK", color: "#d32f2f", logo: "🏆" },
  { name: "Singapore Air",  code: "SQ", color: "#1565c0", logo: "⭐" },
  { name: "Lufthansa",      code: "LH", color: "#fdd835", logo: "🌟" },
];

const AIRPORTS = {
  BOM: { city: "Mumbai",    name: "Chhatrapati Shivaji Intl",  country: "India"   },
  DEL: { city: "Delhi",     name: "Indira Gandhi Intl",        country: "India"   },
  BLR: { city: "Bangalore", name: "Kempegowda Intl",           country: "India"   },
  HYD: { city: "Hyderabad", name: "Rajiv Gandhi Intl",         country: "India"   },
  MAA: { city: "Chennai",   name: "Chennai Intl",              country: "India"   },
  CCU: { city: "Kolkata",   name: "Netaji Subhas Chandra Bose",country: "India"   },
  DXB: { city: "Dubai",     name: "Dubai Intl",                country: "UAE"     },
  LHR: { city: "London",    name: "Heathrow",                  country: "UK"      },
  SIN: { city: "Singapore", name: "Changi",                    country: "Singapore"},
  JFK: { city: "New York",  name: "John F. Kennedy Intl",      country: "USA"     },
  CDG: { city: "Paris",     name: "Charles de Gaulle",         country: "France"  },
  FRA: { city: "Frankfurt", name: "Frankfurt Intl",            country: "Germany" },
};

function pad(n) { return String(n).padStart(2, "0"); }
function fmtTime(h, m) { return `${pad(h)}:${pad(m)}`; }
function addMinutes(h, m, mins) {
  const total = h * 60 + m + mins;
  return { h: Math.floor(total / 60) % 24, m: total % 60, days: Math.floor(total / (60 * 24)) };
}
function fmtDuration(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function generateFlights(origin, destination, departDate, returnDate) {
  const originCode = resolveCode(origin);
  const destCode   = resolveCode(destination);

  const outbound = generateLeg(originCode, destCode, departDate, 8 + Math.floor(Math.random() * 3));
  const inbound  = returnDate
    ? generateLeg(destCode, originCode, returnDate, 8 + Math.floor(Math.random() * 3))
    : null;

  return { outbound, inbound, origin: originCode, destination: destCode };
}

function resolveCode(input) {
  if (!input) return "BOM";
  const up = input.toUpperCase().trim();
  if (AIRPORTS[up]) return up;
  // match by city name
  for (const [code, info] of Object.entries(AIRPORTS)) {
    if (info.city.toLowerCase().includes(input.toLowerCase())) return code;
  }
  return "BOM";
}

function generateLeg(from, to, date, count) {
  const results = [];
  const basePrice = getBasePrice(from, to);

  for (let i = 0; i < count; i++) {
    const airline   = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const depH      = 5 + Math.floor(Math.random() * 18);
    const depM      = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 11)];
    const isNonstop = Math.random() > 0.4;
    const baseDur   = getBaseDuration(from, to);
    const duration  = isNonstop
      ? baseDur + Math.floor(Math.random() * 30) - 15
      : baseDur + 90 + Math.floor(Math.random() * 120);

    const arr = addMinutes(depH, depM, duration);
    const flightNum = `${airline.code}${100 + Math.floor(Math.random() * 900)}`;
    const priceVariance = 0.7 + Math.random() * 0.8;
    const price = Math.round(basePrice * priceVariance * (isNonstop ? 1 : 0.85) / 100) * 100;

    const stops = isNonstop ? [] : generateStops(from, to);

    results.push({
      id: `${flightNum}-${i}`,
      airline,
      flightNum,
      from,
      to,
      fromInfo: AIRPORTS[from] || { city: from, name: from, country: "" },
      toInfo:   AIRPORTS[to]   || { city: to,   name: to,   country: "" },
      date,
      depTime:  fmtTime(depH, depM),
      arrTime:  fmtTime(arr.h, arr.m),
      arrNextDay: arr.days > 0,
      duration: fmtDuration(duration),
      durationMins: duration,
      stops,
      stopCount: stops.length,
      price,
      cabin: "Economy",
      seatsLeft: 1 + Math.floor(Math.random() * 9),
      baggage: isNonstop ? "15kg" : "20kg",
      refundable: Math.random() > 0.5,
    });
  }

  return results.sort((a, b) => a.price - b.price);
}

function getBasePrice(from, to) {
  const intl = ["DXB","LHR","SIN","JFK","CDG","FRA"];
  const fromIntl = intl.includes(from), toIntl = intl.includes(to);
  if (fromIntl || toIntl) return 25000 + Math.floor(Math.random() * 40000);
  return 3000 + Math.floor(Math.random() * 8000);
}

function getBaseDuration(from, to) {
  const intl = ["DXB","LHR","SIN","JFK","CDG","FRA"];
  const fromIntl = intl.includes(from), toIntl = intl.includes(to);
  if (fromIntl || toIntl) return 240 + Math.floor(Math.random() * 480);
  return 60 + Math.floor(Math.random() * 120);
}

function generateStops(from, to) {
  const domestic = ["BOM","DEL","BLR","HYD","MAA","CCU"];
  const pool = domestic.filter(c => c !== from && c !== to);
  const stop = pool[Math.floor(Math.random() * pool.length)];
  const layover = 60 + Math.floor(Math.random() * 180);
  return [{ code: stop, city: AIRPORTS[stop]?.city || stop, layover: fmtDuration(layover) }];
}

export function getAirportInfo(code) {
  return AIRPORTS[code] || { city: code, name: code, country: "" };
}

export { AIRPORTS };
