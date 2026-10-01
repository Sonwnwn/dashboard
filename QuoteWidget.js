import UIComponent from './UIComponent.js';
export default class QuoteWidget extends UIComponent {
  #fallbackIndex=-1;
  #fallback=[['Начать — уже половина дела.','Народная мудрость'],['Даже маленький шаг приближает к большой цели.','Напоминание на день'],['Оставьте в своём дне место для новой идеи.','Напоминание на день']];
  constructor(config){super({...config,title:'Немного вдохновения',icon:'❞'});}
  render(){super.render();this.body.innerHTML='<div class="quote-mark">“</div><blockquote></blockquote><p class="quote-author"></p><div class="quote-footer"><span class="quote-source" role="status"></span><button class="refresh text-button">↻ Обновить</button></div>';this.listen(this.body.querySelector('button'),'click',()=>this.load());this.load();return this.element;}
  async load(){const button=this.body.querySelector('button');button.disabled=true;this.body.querySelector('.quote-source').textContent='Загружаем цитату…';try{const data=await this.fetchJSON('https://api.quotable.io/random');if(typeof data.content!=='string'||typeof data.author!=='string')throw new Error('Некорректный ответ');if(this.destroyed)return;this.show(data.content,data.author,'Quotable · оригинал на английском');}catch{if(this.destroyed)return;this.#fallbackIndex=(this.#fallbackIndex+1)%this.#fallback.length;this.show(...this.#fallback[this.#fallbackIndex],'Quotable недоступен · локальная цитата');}finally{if(!this.destroyed)button.disabled=false;}}
  show(text,author,source){this.body.querySelector('blockquote').textContent=text;this.body.querySelector('.quote-author').textContent=author;this.body.querySelector('.quote-source').textContent=source;}
}
