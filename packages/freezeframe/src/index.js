import imagesLoaded from 'imagesloaded';
import {
  pipe,
  normalizeElements,
  validateElements,
  dedupeImages,
  isTouch,
  wrapNode,
  htmlToNode,
  error
} from './utils/index';
import * as templates from './templates';
import {
  classes,
  defaultOptions,
  styleId
} from './constants';

class Freezeframe {
  constructor(target = classes.SELECTOR, options) {
    if (
      typeof target === 'string' ||
      target instanceof Element ||
      target instanceof HTMLCollection ||
      target instanceof NodeList
    ) {
      this.options = { ...defaultOptions, ...options };
      this.target = target;
    } else if (typeof target === 'object' && !options) {
      this.options = { ...defaultOptions, ...target };
      this.target = this.options.selector;
    } else {
      error(
        'Invalid Freezeframe.js configuration:',
        ...[target, options].filter((arg) => arg !== undefined)
      );
    }
    this.items = [];
    this.images = [];
    this.eventListeners = {
      start: [],
      stop: [],
      toggle: [],
      ready: []
    };
    this.init(this.target);
  }

  init(selectorOrNodes) {
    this.injectStylesheet();
    this.isTouch = isTouch();
    this.capture(selectorOrNodes);
    this.load(this.images);
  }

  capture(selectorOrNodes) {
    this.images = pipe(
      normalizeElements,
      validateElements,
      dedupeImages
    )(selectorOrNodes, this.options);
  }

  load(images) {
    imagesLoaded(images)
      .on('progress', (instance, { img }) => {
        this.setup(img);
      });
  }

  async setup(image) {
    const freeze = this.wrap(image);
    this.items.push(freeze);
    await this.process(freeze);
    this.attach(freeze);
  }

  wrap(image) {
    const container = htmlToNode(templates.container());
    const canvas = htmlToNode(templates.canvas());

    if (this.options.responsive) {
      container.classList.add(classes.RESPONSIVE);
    }
    if (this.options.overlay) {
      container.appendChild(htmlToNode(templates.overlay()));
    }
    image.classList.add(classes.IMAGE);
    container.appendChild(canvas);
    wrapNode(image, container);

    return {
      container,
      canvas,
      image
    };
  }

  process(freeze) {
    return new Promise((resolve) => {
      const { canvas, image, container } = freeze;

      // Wait for the image to be fully loaded
      if (!image.complete || image.naturalWidth === 0) {
        image.addEventListener('load', () => this.processImage(freeze, resolve));
      } else {
        this.processImage(freeze, resolve);
      }
    });
  }

  processImage(freeze, resolve) {
    const { canvas, image, container } = freeze;
    const rect = image.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientWidth = Math.ceil(width);
    const clientHeight = Math.ceil(height);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.setAttribute('width', clientWidth.toString());
    canvas.setAttribute('height', clientHeight.toString());

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, clientWidth, clientHeight);

    canvas.classList.add(classes.CANVAS_READY);

    canvas.addEventListener('transitionend', () => {
      this.ready(container);
      this.emit('ready', freeze);
      resolve(freeze);
    }, {
      once: true
    });
  }

  ready(container) {
    container.classList.add(classes.READY);
    container.classList.add(classes.INACTIVE);
    container.classList.remove(classes.LOADING_ICON);
  }

  attach(freeze) {
    const { image } = freeze;

    if (!this.isTouch && this.options.trigger === 'hover') {
      const onMouseEnter = () => {
        this.toggleOn(freeze);
        this.emit('start', freeze, true);
        this.emit('toggle', freeze, true);
      };
      const onMouseLeave = () => {
        this.toggleOff(freeze);
        this.emit('start', freeze, false);
        this.emit('toggle', freeze, false);
      };
      this.addEventListener(image, 'mouseleave', onMouseLeave);
      this.addEventListener(image, 'mouseenter', onMouseEnter);
    }

    if (this.isTouch || this.options.trigger === 'click') {
      const onClick = () => {
        this.toggle(freeze);
      };
      this.addEventListener(image, 'click', onClick);
    }
  }

  addEventListener(image, event, listener) {
    this.internalEvents = this.internalEvents || [];
    this.internalEvents.push({ image, event, listener });
    image.addEventListener(event, listener);
  }

  removeEventListener(image, event, listener) {
    image.removeEventListener(event, listener);
  }

  injectStylesheet() {
    if (document.querySelector(`style#${styleId}`)) return;
    document.head.appendChild(
      htmlToNode(
        templates.stylesheet()
      )
    );
  }

  emit(event, items, isPlaying) {
    this.eventListeners[event].forEach((cb) => {
      cb(Array.isArray(items) && items.length === 1 ? items[0] : items, isPlaying);
    });
  }

  toggleOn(freeze) {
    const { container, image } = freeze;

    if (container.classList.contains(classes.READY)) {
      image.setAttribute('src', image.src);
      container.classList.remove(classes.INACTIVE);
      container.classList.add(classes.ACTIVE);
    }
  }

  toggleOff(freeze) {
    const { container } = freeze;

    if (container.classList.contains(classes.READY)) {
      container.classList.add(classes.INACTIVE);
      container.classList.remove(classes.ACTIVE);
    }
  }

  toggle(freeze) {
    const { container } = freeze;
    const isActive = container.classList.contains(classes.ACTIVE);

    if (isActive) {
      this.toggleOff(freeze);
    } else {
      this.toggleOn(freeze);
    }
    return !isActive;
  }

  start() {
    this.items.forEach((freeze) => {
      this.toggleOn(freeze);
      this.emit('start', freeze, true);
      this.emit('toggle', freeze, true);
    });
  }

  stop() {
    this.items.forEach((freeze) => {
      this.toggleOff(freeze);
      this.emit('stop', freeze, false);
      this.emit('toggle', freeze, false);
    });
  }

  on(event, cb) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(cb);
    }
  }

  destroy() {
    this.items.forEach((freeze) => {
      const { image } = freeze;
      (this.internalEvents || []).forEach(({ image: eventImage, event, listener }) => {
        if (eventImage === image) {
          this.removeEventListener(image, event, listener);
        }
      });
    });
    this.items = [];
    this.images = [];
    this.eventListeners = {
      start: [],
      stop: [],
      toggle: [],
      ready: []
    };
  }
}

export default Freezeframe; 