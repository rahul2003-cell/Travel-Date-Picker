import { useState } from "react";
import { formatINR } from "../utils/helpers.js";

export default function BookingModal({ flight, returnFlight, onClose, onConfirm }) {
  const [step, setStep]       = useState(1); // 1=details, 2=payment, 3=confirmed
  const [form, setForm]       = useState({ name:"", email:"", phone:"", dob:"" });
  const [payment, setPayment] = useState({ card:"", expiry:"", cvv:"", name:"" });
  const [errors, setErrors]   = useState({});

  const total = flight.price + (returnFlight ? returnFlight.price : 0);

  function update(f, k, v) {
    f === "form" ? setForm(p => ({...p,[k]:v})) : setPayment(p => ({...p,[k]:v}));
    setErrors(p => ({...p,[k]:""}));
  }

  function validateStep1() {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit phone required";
    if (!form.dob) e.dob = "Date of birth required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    const cleanCard = payment.card.replace(/\s/g,"");
    if (cleanCard.length !== 16) e.card = "16-digit card required";
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Format MM/YY";
    if (!payment.cvv.match(/^\d{3,4}$/)) e.cvv = "3 or 4 digits";
    if (!payment.name.trim()) e.name = "Name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  const bookingRef = `SKY${Math.random().toString(36).substr(2,8).toUpperCase()}`;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Progress */}
        <div className="modal-progress">
          {["Traveller", "Payment", "Confirmed"].map((label, i) => (
            <div key={i} className={`prog-step${step > i ? " done" : ""}${step === i+1 ? " active" : ""}`}>
              <div className="prog-circle">{step > i+1 ? "✓" : i+1}</div>
              <span>{label}</span>
            </div>
          ))}
          <div className="prog-line" style={{ width: `${(step-1)*50}%` }} />
        </div>

        {/* Flight Summary */}
        <div className="modal-flight-summary">
          <div className="mfs-leg">
            <span className="mfs-tag">Outbound</span>
            <strong>{flight.airline.logo} {flight.from} → {flight.to}</strong>
            <span>{flight.depTime} – {flight.arrTime} · {flight.airline.name} {flight.flightNum}</span>
            <span className="mfs-price">{formatINR(flight.price)}</span>
          </div>
          {returnFlight && (
            <div className="mfs-leg">
              <span className="mfs-tag return">Return</span>
              <strong>{returnFlight.airline.logo} {returnFlight.from} → {returnFlight.to}</strong>
              <span>{returnFlight.depTime} – {returnFlight.arrTime} · {returnFlight.airline.name} {returnFlight.flightNum}</span>
              <span className="mfs-price">{formatINR(returnFlight.price)}</span>
            </div>
          )}
          <div className="mfs-total">Total: <strong>{formatINR(total)}</strong></div>
        </div>

        {/* Step 1 – Traveller */}
        {step === 1 && (
          <div className="modal-form">
            <h3 className="form-title">Traveller Details</h3>
            <div className="form-grid">
              <div className={`form-group${errors.name ? " err" : ""}`}>
                <label>Full Name</label>
                <input placeholder="As on passport" value={form.name} onChange={e => update("form","name",e.target.value)} />
                {errors.name && <span className="form-err">{errors.name}</span>}
              </div>
              <div className={`form-group${errors.email ? " err" : ""}`}>
                <label>Email</label>
                <input type="email" placeholder="you@email.com" value={form.email} onChange={e => update("form","email",e.target.value)} />
                {errors.email && <span className="form-err">{errors.email}</span>}
              </div>
              <div className={`form-group${errors.phone ? " err" : ""}`}>
                <label>Phone</label>
                <input placeholder="10-digit mobile" value={form.phone} maxLength={10} onChange={e => update("form","phone",e.target.value.replace(/\D/,""))} />
                {errors.phone && <span className="form-err">{errors.phone}</span>}
              </div>
              <div className={`form-group${errors.dob ? " err" : ""}`}>
                <label>Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => update("form","dob",e.target.value)} />
                {errors.dob && <span className="form-err">{errors.dob}</span>}
              </div>
            </div>
            <button className="btn-primary full" onClick={handleNext}>Continue to Payment →</button>
          </div>
        )}

        {/* Step 2 – Payment */}
        {step === 2 && (
          <div className="modal-form">
            <h3 className="form-title">Payment Details</h3>
            <div className="card-visual">
              <div className="cv-chip">▨</div>
              <div className="cv-num">{payment.card || "•••• •••• •••• ••••"}</div>
              <div className="cv-row">
                <span>{payment.name || "CARD HOLDER"}</span>
                <span>{payment.expiry || "MM/YY"}</span>
              </div>
            </div>
            <div className="form-grid">
              <div className={`form-group full${errors.card ? " err" : ""}`}>
                <label>Card Number</label>
                <input placeholder="1234 5678 9012 3456" value={payment.card} maxLength={19}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g,"").slice(0,16);
                    update("payment","card", v.replace(/(.{4})/g,"$1 ").trim());
                  }} />
                {errors.card && <span className="form-err">{errors.card}</span>}
              </div>
              <div className={`form-group${errors.expiry ? " err" : ""}`}>
                <label>Expiry</label>
                <input placeholder="MM/YY" value={payment.expiry} maxLength={5}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g,"");
                    if (v.length > 2) v = v.slice(0,2)+"/"+v.slice(2,4);
                    update("payment","expiry",v);
                  }} />
                {errors.expiry && <span className="form-err">{errors.expiry}</span>}
              </div>
              <div className={`form-group${errors.cvv ? " err" : ""}`}>
                <label>CVV</label>
                <input placeholder="123" value={payment.cvv} maxLength={4}
                  onChange={e => update("payment","cvv",e.target.value.replace(/\D/g,""))} />
                {errors.cvv && <span className="form-err">{errors.cvv}</span>}
              </div>
              <div className={`form-group full${errors.name ? " err" : ""}`}>
                <label>Name on Card</label>
                <input placeholder="Name as printed" value={payment.name} onChange={e => update("payment","name",e.target.value)} />
                {errors.name && <span className="form-err">{errors.name}</span>}
              </div>
            </div>
            <button className="btn-primary full" onClick={handleNext}>
              Pay {formatINR(total)} →
            </button>
          </div>
        )}

        {/* Step 3 – Confirmed */}
        {step === 3 && (
          <div className="confirmed-view">
            <div className="confirm-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your booking reference is</p>
            <div className="booking-ref">{bookingRef}</div>
            <p className="confirm-sub">A confirmation has been sent to <strong>{form.email}</strong></p>
            <div className="confirm-details">
              <div>✈ {flight.from} → {flight.to} · {flight.depTime}</div>
              {returnFlight && <div>✈ {returnFlight.from} → {returnFlight.to} · {returnFlight.depTime}</div>}
              <div>👤 {form.name}</div>
              <div>💰 {formatINR(total)} paid</div>
            </div>
            <button className="btn-primary" onClick={() => { onConfirm(); onClose(); }}>
              Back to Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
