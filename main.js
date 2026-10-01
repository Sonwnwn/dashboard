import Dashboard from './js/Dashboard.js';
const dashboard=new Dashboard(document.getElementById('dashboard'));
dashboard.initialize();
const toggle=document.getElementById('add-toggle'),menu=document.getElementById('widget-menu');
function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));}
toggle.addEventListener('click',()=>setMenu(menu.hidden));
menu.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button){const widget=dashboard.addWidget(button.dataset.add);setMenu(false);widget.element.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});widget.element.querySelector('button').focus();}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){setMenu(false);toggle.focus();}});
document.getElementById('top-date').textContent=new Date().toLocaleDateString('ru-RU',{timeZone:'Europe/Moscow',day:'numeric',month:'long',year:'numeric'});
window.addEventListener('pagehide',event=>{if(!event.persisted)dashboard.destroy();},{once:true});
