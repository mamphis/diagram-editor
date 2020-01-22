import { Diagram } from "../diagram/diagram";

export class Button {
    constructor(public name: string, public onclick: (diagram: Diagram) => void) {

    }
}