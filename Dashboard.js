import ToDoWidget from './ToDoWidget.js';
import WeatherWidget from './WeatherWidget.js';
import QuoteWidget from './QuoteWidget.js';
import ClockWidget from './ClockWidget.js';
import NotesWidget from './NotesWidget.js';
import {read,write} from './storage.js';
export default class Dashboard {
  #widgets=[];
  #registry=new Map([['todo',ToDoWidget],['weather',WeatherWidget],['clock',ClockWidget],['notes',NotesWidget],['quote',QuoteWidget]]);
  constructor(container){this.container=container;}
  register(type,WidgetClass){this.#registry.set(type,WidgetClass);}
  initialize(){const saved=read('blue-day:layout',null);const defaults=['todo','weather','clock','notes','quote'];if(Array.isArray(saved))saved.forEach(config=>{if(config&&this.#registry.has(config.type))this.addWidget(config.type,config,false);});else defaults.forEach(type=>this.addWidget(type,{},false));this.persist();}
  addWidget(widgetType,config={},save=true){const Widget=this.#registry.get(widgetType);if(!Widget)throw new Error(`Неизвестный виджет: ${widgetType}`);const id=typeof config.id==='string'&&!this.#widgets.some(w=>w.id===config.id)?config.id:crypto.randomUUID();const widget=new Widget({id,type:widgetType,onClose:id=>this.removeWidget(id),onChange:()=>this.persist()});this.#widgets.push(widget);this.container.append(widget.render());if(config.minimized)widget.minimize(true);if(save){this.persist();document.getElementById('announcement').textContent=`Добавлен виджет ${widget.title}`;}return widget;}
  removeWidget(widgetId){const index=this.#widgets.findIndex(widget=>widget.id===widgetId);if(index<0)return;const [widget]=this.#widgets.splice(index,1);widget.destroy();this.persist();document.getElementById('add-toggle').focus();document.getElementById('announcement').textContent=`Удалён виджет ${widget.title}`;}
  persist(){write('blue-day:layout',this.#widgets.map(widget=>widget.serialize()));document.getElementById('widget-count').textContent=`Виджетов на столе: ${this.#widgets.length}`;document.getElementById('empty').hidden=this.#widgets.length>0;}
  destroy(){this.#widgets.forEach(widget=>widget.destroy());this.#widgets=[];}
}
