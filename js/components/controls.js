import { debounce } from '../utils/debounce.js';

export function createControls(container, state, actions){
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'controls-inner';
  wrapper.style.display = 'flex';
  wrapper.style.gap = '8px';
  wrapper.style.alignItems = 'center';
  wrapper.style.flexWrap = 'wrap';

  // Global search (with label for accessibility)
  const gLabel = document.createElement('label');
  gLabel.className = 'sr-only';
  gLabel.htmlFor = 'global-search';
  gLabel.textContent = 'Global search';
  const input = document.createElement('input');
  input.id = 'global-search';
  input.className = 'global-search';
  input.placeholder = 'Search (global)...';
  input.value = state.filters.global || '';
  input.addEventListener('input', debounce((e)=>{
    // copy current column filters to avoid mutation surprises
    actions.setFilter({global: e.target.value, columns: {...state.filters.columns}});
  }, 300));
  wrapper.appendChild(gLabel);
  wrapper.appendChild(input);

  // Per-column small filters
  const colFilters = document.createElement('div');
  colFilters.className = 'col-filters';
  colFilters.style.display = 'flex';
  colFilters.style.gap = '6px';
  colFilters.style.flexWrap = 'wrap';

  // IMPORTANT FIX: iterate over the actual keys array, not Object.keys(array)
  state.columnKeys.forEach(key => {
    const lbl = document.createElement('label');
    lbl.className = 'sr-only';
    lbl.htmlFor = `filter-${key}`;
    lbl.textContent = `Filter ${key}`;

    const inp = document.createElement('input');
    inp.id = `filter-${key}`;
    inp.placeholder = key;
    inp.value = state.filters.columns[key] || '';
    inp.addEventListener('input', debounce((e)=>{
      const newCols = {...state.filters.columns, [key]: e.target.value};
      actions.setFilter({global: state.filters.global, columns: newCols});
    }, 300));
    inp.style.width = '120px';

    colFilters.appendChild(lbl);
    colFilters.appendChild(inp);
  });

  wrapper.appendChild(colFilters);

  // Page size selector
  const selectLabel = document.createElement('label');
  selectLabel.className = 'sr-only';
  selectLabel.htmlFor = 'page-size';
  selectLabel.textContent = 'Page size';

  const select = document.createElement('select');
  select.id = 'page-size';
  select.className = 'page-size';
  [10,25,50,100].forEach(n=>{
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = `${n} / page`;
    if(n === state.pageSize) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => actions.setPageSize(Number(e.target.value)));

  wrapper.appendChild(selectLabel);
  wrapper.appendChild(select);

  container.appendChild(wrapper);
}

export function renderPagination(container, total, page, pageSize, actions){
  container.innerHTML = '';
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const info = document.createElement('div'); info.className = 'page-info';
  info.textContent = `Showing ${Math.min(total, (page-1)*pageSize+1)}-${Math.min(total, page*pageSize)} of ${total}`;
  container.appendChild(info);

  const pager = document.createElement('div'); pager.className = 'pager';
  const makeBtn = (label, p, disabled=false, current=false)=>{
    const b = document.createElement('button'); b.type='button'; b.textContent = label; if(disabled) b.disabled = true; if(current) b.setAttribute('aria-current','true');
    b.addEventListener('click', ()=> actions.setPage(p));
    return b;
  };
  pager.appendChild(makeBtn('First', 1, page===1));
  pager.appendChild(makeBtn('Prev', Math.max(1, page-1), page===1));

  // show up to 5 pages around current
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for(let p = start; p <= end; p++) pager.appendChild(makeBtn(String(p), p, false, p===page));

  pager.appendChild(makeBtn('Next', Math.min(pages, page+1), page===pages));
  pager.appendChild(makeBtn('Last', pages, page===pages));
  container.appendChild(pager);
}
