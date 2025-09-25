export async function loadData(url = 'data/sample.json'){
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('Failed to load data');
    const json = await res.json();
    return json;
  }catch(e){
    console.error(e);
    throw e;
  }
}
