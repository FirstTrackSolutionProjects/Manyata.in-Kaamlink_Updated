export function filterRows(items, search, fields) {
  return (Array.isArray(items) ? items : []).filter((item) => !search || fields.some((key) => String(key.split(".").reduce((value, part) => value?.[part], item) ?? "").toLowerCase().includes(search.toLowerCase())));
}
