import { loadData } from './services/dataService.js';
import { initState } from './state/stateManager.js';

(async function(){
  const debug = document.getElementById('debug');
  try{
    debug.textContent = 'Loading data...';
    const data = await loadData();
    initState(data);
    debug.textContent = '';
  }catch(e){
    debug.textContent = 'Error loading data.';
    console.error(e);
  }
})();
