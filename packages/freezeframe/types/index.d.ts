export type SelectorOrNodes = string | Element | HTMLCollection | NodeList;
export type FreezeframeEventTypes = 'start' | 'stop' | 'toggle';

export interface Freeze {
  $container: HTMLElement;
  $canvas: HTMLCanvasElement;
  $image: HTMLImageElement;
}

export interface FreezeframeEvent {
  $image: HTMLImageElement;
  event: string;
  listener: EventListenerOrEventListenerObject;
}

export interface FreezeframeOptions {
  selector?: string;
  trigger?: 'hover' | 'click' | 'toggle';
  overlay?: boolean;
  responsive?: boolean;
  warnings?: boolean;
}

export interface RequireProps<T, K extends keyof T> {
  [P in K]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
}; 