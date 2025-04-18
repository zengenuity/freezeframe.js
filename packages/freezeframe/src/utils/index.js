export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

export const normalizeElements = (selectorOrNodes, options) => {
  if (typeof selectorOrNodes === 'string') {
    return Array.from(document.querySelectorAll(selectorOrNodes));
  }
  if (selectorOrNodes instanceof Element) {
    return [selectorOrNodes];
  }
  if (selectorOrNodes instanceof HTMLCollection || selectorOrNodes instanceof NodeList) {
    return Array.from(selectorOrNodes);
  }
  return [];
};

export const validateElements = (elements) => {
  return elements.filter((element) => {
    if (!(element instanceof HTMLImageElement)) {
      console.warn('Freezeframe: Element is not an image', element);
      return false;
    }
    if (!element.src) {
      console.warn('Freezeframe: Image has no src attribute', element);
      return false;
    }
    return true;
  });
};

export const dedupeImages = (images) => {
  const seen = new Set();
  return images.filter((image) => {
    const duplicate = seen.has(image.src);
    seen.add(image.src);
    return !duplicate;
  });
};

export const isTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const wrapNode = (node, wrapper) => {
  node.parentNode.insertBefore(wrapper, node);
  wrapper.appendChild(node);
};

export const htmlToNode = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

export const error = (...args) => {
  console.error('Freezeframe:', ...args);
}; 