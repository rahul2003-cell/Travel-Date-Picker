# ✈️ Skyscanner Travel Date Picker — Fully Functional

A complete, multi-page flight booking app built with React + Vite.

## 🚀 Getting Started

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## ✅ Features

### Home Page
- Round-trip / One-way toggle
- Origin & destination inputs with swap button
- Calendar date picker with range selection & validation
- Night count display
- Popular route quick-fill cards

### Results Page
- 8–11 mock flights generated per leg
- Filter by: stops (non-stop / with stops), max price
- Sort by: price, duration, departure time
- Expandable flight cards showing baggage, cabin, refundability, seats left
- Outbound / Return tabs for round trips

### Booking Modal (3 steps)
1. **Traveller Details** — name, email, phone, DOB with validation
2. **Payment** — card number (auto-formatted), expiry, CVV, cardholder name
3. **Confirmation** — booking reference, summary, email confirmation

### UX Details
- Animated loading screen while searching
- Click-outside to close calendar
- Past date protection in calendar
- Responsive layout (mobile-friendly)
- Smooth animations throughout

## 📁 Project Structure

```
src/
├── App.jsx                    # Root: routing + global CSS
├── main.jsx                   # React entry
├── data/
│   └── flights.js             # Mock flight generator
├── utils/
│   └── helpers.js             # Date & format utilities
├── components/
│   ├── DatePicker.jsx         # Calendar popover
│   ├── FlightCard.jsx         # Individual flight row
│   └── BookingModal.jsx       # 3-step booking flow
└── pages/
    ├── HomePage.jsx           # Search form
    └── ResultsPage.jsx        # Flight listings + filters
```

## 🛠 Tech Stack

- React 18, Hooks (useState, useMemo, useCallback, useRef, useEffect)
- Vite 5
- Pure CSS with CSS variables
- No external UI libraries
