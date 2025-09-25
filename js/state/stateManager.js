import { applyFilters } from '../utils/filter.js';
import { renderTableHead, renderTableBody, applySortAndPaginate, columns } from '../components/tableRenderer.js';
import { createControls, renderPagination } from '../components/controls.js';

export const state = {
  raw: [],
  sort: {key:null, dir:null},
  filters: {global:'', columns:{}},
  page: 1,
  pageSize: 10
};

const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');
const controlsEl = document.getElementById('controls');
const paginationEl = document.getElementById('pagination');
const emptyEl = document.getElementById('empty-state');

export function initState(rawData){
  state.raw = rawData;
  // initialize column filter keys
  state.columnKeys = columns.map(c => c.key);
  state.filters.columns = Object.fromEntries(state.columnKeys.map(k=>[k, '']));
  recomputeAndRender();
}

export function recomputeAndRender(){
  // controls
  createControls(controlsEl, state, {
    setFilter: (f)=>{ state.filters = f; state.page = 1; recomputeAndRender(); },
    setPageSize: (n)=>{ state.pageSize = n; state.page = 1; recomputeAndRender(); }
  });

  const filtered = applyFilters(state.raw, state.filters);
  const {visible, total} = applySortAndPaginate(filtered, state.sort, state.page, state.pageSize);

  if(total === 0){ emptyEl.classList.remove('hidden'); } else { emptyEl.classList.add('hidden'); }

  renderTableHead(tableHead, state.sort, toggleSort);
  renderTableBody(tableBody, visible);
  renderPagination(paginationEl, total, state.page, state.pageSize, { setPage: (p)=>{ state.page = p; recomputeAndRender(); } });
}

export function toggleSort(key){
  if(state.sort.key !== key) state.sort = {key, dir: 'asc'};
  else if(state.sort.dir === 'asc') state.sort.dir = 'desc';
  else state.sort = {key: null, dir: null};
  state.page = 1; recomputeAndRender();
}
