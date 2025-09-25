function detectType(v){ if(v==null) return 'string'; if(typeof v === 'number') return 'number'; if(!isNaN(Date.parse(v))) return 'date'; return 'string'; }

export function compareBy(key, dir=1){
  return (a,b)=>{
    const va = a[key], vb = b[key];
    const t = detectType(va);
    if(t === 'number') return (va - vb) * dir;
    if(t === 'date') return (new Date(va) - new Date(vb)) * dir;
    return String(va).localeCompare(String(vb)) * dir;
  };
}

export function stableSort(array, comparator){
  return array.map((v,i)=>[v,i]).sort((aa,bb)=>{
    const r = comparator(aa[0], bb[0]);
    return r !== 0 ? r : aa[1] - bb[1];
  }).map(x=>x[0]);
}
