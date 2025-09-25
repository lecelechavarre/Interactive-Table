import { compareBy, stableSort } from '../utils/sort.js';

export const columns = [
  {key:'id', label:'ID'},
  {key:'name', label:'Name'},
  {key:'email', label:'Email'},
  {key:'age', label:'Age'},
  {key:'joined', label:'Joined', render: v => new Date(v).toLocaleDateString()}
];

export function renderTableHead(el, sortState, onSortToggle){
  el.innerHTML = '';
  const tr = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = col.label;
    btn.setAttribute('data-key', col.key);
    btn.setAttribute('tabindex', '0');
    const s = (sortState.key === col.key) ? sortState.dir : null;
    th.setAttribute('aria-sort', s === 'asc' ? 'ascending' : s === 'desc' ? 'descending' : 'none');
    btn.addEventListener('click', ()=> onSortToggle(col.key));
    btn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSortToggle(col.key); } });
    th.appendChild(btn);
    tr.appendChild(th);
  });
  el.appendChild(tr);
}

export function renderTableBody(tbodyEl, rows){
  tbodyEl.innerHTML = '';
  if(!rows.length) return;
  const frag = document.createDocumentFragment();
  rows.forEach(r => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      const v = r[col.key];
      td.innerHTML = col.render ? col.render(v) : String(v ?? '');
      tr.appendChild(td);
    })
    frag.appendChild(tr);
  });
  tbodyEl.appendChild(frag);
}

export function applySortAndPaginate(raw, sort, page, pageSize){
  let arr = Array.from(raw);
  if(sort && sort.key){
    const dir = sort.dir === 'asc' ? 1 : -1;
    arr = stableSort(arr, compareBy(sort.key, dir));
  }
  const total = arr.length;
  const start = (page-1)*pageSize;
  const visible = arr.slice(start, start + pageSize);
  return {visible, total};
}
