import { BaseShape } from "./shapes/baseshape";
import { Rectangle } from "./shapes/rectangle";
import { Triangle } from "./shapes/triangle";
export class ShapeRegistry {
    shapes: (new (x: number, y: number, w: number, h: number) => BaseShape)[] = [];

    constructor() {
        this.shapes.push(Rectangle);
        this.shapes.push(Triangle)
    }
}