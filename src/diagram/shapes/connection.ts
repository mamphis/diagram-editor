
import { IShape } from "./ishape";
import { Diagram } from "../diagram";

export class Connection {
    constructor(public start: IShape, public end: IShape) {

    }

    draw(diagram: Diagram): void {

    }
}