class Helper {
  static randomColor(haveAlpha = false){
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = haveAlpha ? (Math.random().toFixed(2)) : 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  static createElement(tag, {text = "", value = "", classes = [], attrs = {}, dataAttrs = {}, styles = {}, listeners = {}, children = []}){
    const element = document.createElement(tag);
    if (["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)){
      if (value) element.value = value
    } else {
      if (text) element.textContent = text
    }
    if(classes.length) element.classList.add(...classes);
    Object.entries(attrs).forEach(([attr, value]) => element.setAttribute(attr, value));
    Object.entries(dataAttrs).forEach(([dataAttr, value]) => element.dataset[dataAttr] = value);
    Object.entries(styles).forEach(([property, value]) => element.style[property] = value);
    Object.entries(listeners).forEach(([event, handler]) => element.addEventListener(event, handler))
    children.forEach(child => element.appendChild(child));
    return element;
  }
}

export { Helper };