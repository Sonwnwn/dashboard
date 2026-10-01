/** Abstract component: shared DOM, lifecycle, event and request cleanup. */
export default class UIComponent {
  #listeners = [];
  #requests = new Set();
  constructor({id, title, type, icon, onClose, onChange}) {
    if (new.target === UIComponent) throw new TypeError('UIComponent — абстрактный класс');
    Object.assign(this, {id, title, type, icon, onClose, onChange});
    this.minimized = false; this.destroyed = false;
  }
  render() {
    if (this.element) return this.element;
    this.element = document.createElement('article');
    this.element.className = `widget widget-${this.type}`;
    this.element.dataset.id = this.id;
    this.element.innerHTML = `<header class="widget-header"><h2><span class="widget-icon">${this.icon}</span>${this.title}</h2><div class="widget-actions"><button class="minimize" aria-label="Свернуть ${this.title}" aria-expanded="true">−</button><button class="close" aria-label="Удалить ${this.title}">×</button></div></header><div class="widget-body"></div>`;
    this.body = this.element.querySelector('.widget-body');
    this.listen(this.element.querySelector('.minimize'), 'click', () => this.minimize());
    this.listen(this.element.querySelector('.close'), 'click', () => this.close());
    return this.element;
  }
  listen(target, event, handler) { target.addEventListener(event, handler); this.#listeners.push([target,event,handler]); }
  minimize(value = !this.minimized) {
    this.minimized = value; this.body.hidden = value;
    const button = this.element.querySelector('.minimize');
    button.textContent = value ? '+' : '−'; button.setAttribute('aria-expanded', String(!value));
    button.setAttribute('aria-label', `${value ? 'Развернуть' : 'Свернуть'} ${this.title}`);
    this.element.classList.toggle('minimized', value); this.onChange?.();
  }
  close() { this.onClose(this.id); }
  async fetchJSON(url) {
    const controller = new AbortController(); this.#requests.add(controller);
    const timeout = setTimeout(() => controller.abort(), 10000);
    try { const response = await fetch(url, {signal:controller.signal}); if(!response.ok) throw new Error(`HTTP ${response.status}`); return await response.json(); }
    finally { clearTimeout(timeout); this.#requests.delete(controller); }
  }
  serialize() { return {id:this.id,type:this.type,minimized:this.minimized}; }
  destroy() {
    this.destroyed = true;
    this.#listeners.forEach(([target,event,handler]) => target.removeEventListener(event,handler));
    this.#listeners = []; this.#requests.forEach(controller => controller.abort()); this.#requests.clear(); this.element?.remove();
  }
}
