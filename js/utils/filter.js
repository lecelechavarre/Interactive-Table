export function applyFilters(data, filters){
  const {global='', columns={}} = filters || {};
  const g = String(global||'').trim().toLowerCase();
  return data.filter(row => {
    // column filters (exact substring per column)
    for(const key of Object.keys(columns||{})){
      const v = String(row[key] ?? '').toLowerCase();
      const f = String(columns[key] ?? '').trim().toLowerCase();
      if(f && !v.includes(f)) return false;
    }
    if(g === '') return true;
    // global search across stringifiable values
    return Object.values(row).some(val => String(val).toLowerCase().includes(g));
  });
}
