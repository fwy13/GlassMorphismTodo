import React,{useEffect,useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import './style.css';
const api=async(route,options={})=>{const res=await fetch('/api'+route,{headers:{'Content-Type':'application/json'},...options});const body=await res.json().catch(()=>({}));if(!res.ok)throw Error(body.error||`HTTP ${res.status}`);return body;};
function App(){
 const[config,setConfig]=useState({name:'Glass Todo',theme:'aurora',accent:'#9084ff',accent2:'#42d5ef'});
 const[tasks,setTasks]=useState([]),[text,setText]=useState(''),[filter,setFilter]=useState('all'),[search,setSearch]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const refresh=async()=>{const data=await api('/tasks');setTasks(data.tasks);};
 useEffect(()=>{Promise.all([api('/config'),api('/tasks')]).then(([cfg,data])=>{setConfig(cfg);setTasks(data.tasks);document.title=cfg.name+' · Glass Todo';}).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
 const completed=tasks.filter(t=>t.completed).length;
 const visible=useMemo(()=>tasks.filter(t=>(filter==='all'||(filter==='done'?t.completed:!t.completed))&&t.title.toLowerCase().includes(search.toLowerCase())),[tasks,filter,search]);
 const mutation=async(fn)=>{setBusy(true);setError('');try{await fn();await refresh();}catch(e){setError(e.message)}finally{setBusy(false)}};
 return <main className="canvas" style={{'--accent':config.accent,'--accent2':config.accent2}}>
  <div className="orb orb-a"/><div className="orb orb-b"/><div className="orb orb-c"/>
  <section className="panel"><header className="top"><div className="logo">✦</div><div className="top-meta"><span className="eyebrow">FOCUS SPACE / {config.theme.toUpperCase()}</span><h1>{config.name}</h1></div><div className="status"><span className="dot"/> Your workspace</div></header>
  <div className="intro"><span className="eyebrow">MAKE TODAY COUNT</span><h2>Make space for<br/><em>what matters.</em></h2><p>A calmer way to capture your thoughts and move things forward.</p></div>
  <div className="stats"><div><b>{tasks.length}</b><span>Total tasks</span></div><div><b>{tasks.length-completed}</b><span>In progress</span></div><div><b>{completed}</b><span>Completed</span></div></div>
  <form className="add" onSubmit={e=>{e.preventDefault();const title=text.trim();if(!title||busy)return;mutation(async()=>{await api('/tasks',{method:'POST',body:JSON.stringify({title})});setText('');});}}><span className="plus">＋</span><input aria-label="New task" placeholder="What do you want to accomplish?" maxLength={200} value={text} onChange={e=>setText(e.target.value)}/><button disabled={!text.trim()||busy} type="submit">Add task <span>↗</span></button></form>
  <div className="toolbar"><div className="filters">{[['all','All'],['active','Active'],['done','Done']].map(([k,v])=><button key={k} className={filter===k?'selected':''} onClick={()=>setFilter(k)}>{v}</button>)}</div><input className="search" aria-label="Search tasks" placeholder="⌕  Search tasks" value={search} onChange={e=>setSearch(e.target.value)}/></div>
  {error&&<div className="error" role="alert">{error} <button onClick={()=>{setError('');setLoading(true);refresh().catch(e=>setError(e.message)).finally(()=>setLoading(false))}}>Retry</button></div>}
  <div className="task-list">{loading?<div className="empty">Loading your workspace…</div>:visible.length===0?<div className="empty"><div className="empty-art">✧</div><strong>A little room to breathe.</strong><p>{tasks.length?'No tasks match your filters.':'Your list is clear. Add a task to get started.'}</p></div>:visible.map(t=><div className={'task '+(t.completed?'done':'')} key={t.id}><button className="check" aria-label={t.completed?'Mark incomplete':'Mark complete'} disabled={busy} onClick={()=>mutation(()=>api('/tasks/'+t.id,{method:'PATCH',body:JSON.stringify({completed:!t.completed})}))}>{t.completed?'✓':''}</button><span className="task-title">{t.title}</span><button className="trash" aria-label={'Delete '+t.title} disabled={busy} onClick={()=>mutation(()=>api('/tasks/'+t.id,{method:'DELETE'}))}>×</button></div>)}</div>
  <footer><span>✦ &nbsp; Small steps. Big momentum.</span><span>{completed} of {tasks.length} finished</span></footer></section>
 </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
