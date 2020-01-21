import { BaseShape } from "./baseshape";
import { Diagram } from "../diagram";

export class Rectangle extends BaseShape {
    connectionPoints: { x: number; y: number; }[] = [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 }
    ]

    constructor() {
        super("Rectangle", 10, 10, 50, 50);
    }

    draw(diagram: Diagram) {
        diagram.p.fill(diagram.p.red(this.color), diagram.p.green(this.color), diagram.p.blue(this.color), diagram.p.alpha(this.color))
        diagram.p.rect(this.x, this.y, this.w, this.h);
        super.draw(diagram);
    }
}