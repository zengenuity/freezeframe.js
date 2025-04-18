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

declare class Freezeframe {
  constructor(target?: string | Element | HTMLCollection | NodeList, options?: {
    selector?: string | Element | HTMLCollection | NodeList;
    trigger?: 'hover' | 'click' | false;
    responsive?: boolean;
    overlay?: boolean;
  });

  on(event: 'start' | 'stop' | 'toggle' | 'ready', callback: (items: any, isPlaying?: boolean) => void): void;
  start(): void;
  stop(): void;
  destroy(): void;
}

export default Freezeframe; 