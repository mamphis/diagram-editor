import { BaseShape } from "./baseshape";
import { Diagram } from "../diagram";

export class Rectangle extends BaseShape {

    constructor() {
        super("Rectangle", 10, 10, 50, 50);
    }

    draw(diagram: Diagram) {
        super.draw(diagram);

        diagram.p.rect(this.x, this.h, this.w, this.h);
    }
}