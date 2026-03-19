export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export function today() {
  const d = new Date(); d.setHours(0,0,0,0); return d;
}
export function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}
export function isBetween(d, start, end) {
  return start && end && d > start && d < end;
}
export function formatDisplay(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric", year:"numeric" });
}
export function formatShort(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}
export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
export function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(amount);
}
export function nightsBetween(dep, ret) {
  if (!dep || !ret) return null;
  return Math.round((ret - dep) / (1000*60*60*24));
}
