export default function pluralization(locale, qty) {
  const local = locale.split('|');
  if (qty > 1 && local[1]) {
    return local[1];
  }
  return local[0];
}
