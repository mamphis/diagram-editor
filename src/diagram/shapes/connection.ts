import * as p5 from 'p5';
import { IShape } from "./ishape";

export class Connection {
    constructor(public start: IShape, public end: IShape) {

    }

    draw(p: p5): void {

    }
}