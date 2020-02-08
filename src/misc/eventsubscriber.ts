import {Event} from './event';

export class EventSubscriber<T> {
    private subscriptions: { [type: string]: ((data: T) => void)[] } = {};

    constructor(event: Event<T>) {
        event.next = ((type: string, data: T) => {
            let s = this.subscriptions[type];
            if (s) {
                s.forEach(h => {
                    h(data)
                });
            }
        });
    }

    on(type: string, handler: (data: T) => void) {
        if (this.subscriptions[type]) {
            this.subscriptions[type].push(handler);
        } else {
            this.subscriptions[type] = [handler];
        }
    }
}