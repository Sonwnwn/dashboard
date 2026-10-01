import UIComponent from './UIComponent.js';
import {read,write} from './storage.js';
export default class NotesWidget extends UIComponent {
  #text;
  constructor(config){super({...config,title:'Заметки',icon:'▤'});this.#text=read(`notes:${this.id}`,'');if(typeof this.#text!=='string')this.#text='';}
  render(){super.render();this.body.innerHTML=`<p class="section-intro">Место для идей, мыслей и важных мелочей</p><textarea aria-label="Текст заметки" placeholder="О чём не хочется забыть…" maxlength="20000"></textarea><div class="notes-footer"><span class="save-status" role="status">Сохраняется в этом браузере</span><span class="char-count"></span></div>`;const area=this.body.querySelector('textarea');area.value=this.#text;this.listen(area,'input',()=>{this.#text=area.value;this.body.querySelector('.save-status').textContent=write(`notes:${this.id}`,this.#text)?'✓ Сохранено':'Не удалось сохранить';this.count();});this.count();return this.element;}
  count(){this.body.querySelector('.char-count').textContent=`${this.#text.length} символов`;}
}
