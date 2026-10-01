import UIComponent from './UIComponent.js';
export default class ClockWidget extends UIComponent {
  #timer;
  constructor(config){super({...config,title:'Сейчас',icon:'◷'});}
  render(){super.render();this.body.innerHTML='<span class="timezone">МОСКОВСКОЕ ВРЕМЯ · UTC+3</span><div class="clock-time"></div><p class="clock-date"></p><div class="clock-bottom">Время для того, что важно</div>';this.tick();this.#timer=setInterval(()=>this.tick(),1000);return this.element;}
  tick(){const now=new Date();const options={timeZone:'Europe/Moscow'};this.body.querySelector('.clock-time').textContent=now.toLocaleTimeString('ru-RU',{...options,hour:'2-digit',minute:'2-digit',second:'2-digit'});this.body.querySelector('.clock-date').textContent=now.toLocaleDateString('ru-RU',{...options,weekday:'long',day:'numeric',month:'long'});}
  destroy(){clearInterval(this.#timer);super.destroy();}
}
