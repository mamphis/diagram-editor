import { EventSubscriber } from "./eventsubscriber";

export class Event<T> {
    private eventSubscriber: EventSubscriber<T>;
    next: (type: string, data: T) => void = (type: string, data: T) => { console.log("Default next...") };

    constructor() {
        this.eventSubscriber = new EventSubscriber<T>(this);
    }

    fire(type: string, data: T) {
        this.next(type, data);
    }

    get subscriber(): EventSubscriber<T> {
        return this.eventSubscriber;
    }
}