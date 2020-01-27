import { BaseShape } from "./baseshape";
import * as p5 from 'p5';
import { Renderer2D } from "../../misc/renderer2d";
import { DiagramState } from "../../misc/diagramstate";

export class Rectangle extends BaseShape<Rectangle> {
    connectionPoints: { x: number; y: number; }[] = [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 }
    ]

    constructor(x: number, y: number, w: number, h: number) {
        super("Rectangle", x, y, w, h);
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), p.alpha(this.color))
        p.rectMode("corner");
        p.rect(this.x, this.y, this.w, this.h);
        super.draw(p, canvas, state);
    }
}