import { ApplicationEvent, ApplicationEventHandler } from './application-event';

export class ApplicationEventDispatcher {
  private readonly handlers = new Map<string, ApplicationEventHandler[]>();

  register(eventName: string, handler: ApplicationEventHandler): void {
    const list = this.handlers.get(eventName) ?? [];
    list.push(handler);
    this.handlers.set(eventName, list);
  }

  registerAll(eventNames: string[], handler: ApplicationEventHandler): void {
    for (const eventName of eventNames) {
      this.register(eventName, handler);
    }
  }

  async dispatch(event: ApplicationEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];
    await Promise.all(handlers.map((handler) => handler(event)));
  }
}

let dispatcherInstance: ApplicationEventDispatcher | null = null;

export function getApplicationEventDispatcher(): ApplicationEventDispatcher {
  if (!dispatcherInstance) {
    dispatcherInstance = new ApplicationEventDispatcher();
  }
  return dispatcherInstance;
}

export function resetApplicationEventDispatcherForTests(): void {
  dispatcherInstance = null;
}
