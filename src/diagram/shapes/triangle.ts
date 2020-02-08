import { BaseShape } from "./baseshape";
import * as p5 from 'p5';
import { Renderer2D } from "../../misc/renderer2d";
import { DiagramState } from "../../misc/diagramstate";

export class Triangle extends BaseShape<Triangle> {
    connectionPoints: { x: number; y: number; }[] = [
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0.5, y: 1 },
        { x: 0.5, y: 0 },
        { x: 0.25, y: 0.5 },
        { x: 0.75, y: 0.5 }
    ]

    constructor(x: number, y: number, w: number, h: number) {
        super("Triangle", x, y, w, h);
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), p.alpha(this.color))
        p.rectMode("corner");
        p.triangle(this.x, this.y + this.h, this.x + this.w, this.y + this.h, this.x + this.w / 2, this.y );
        super.draw(p, canvas, state);
    }
    serialize(): string {
        return JSON.stringify({ x: this.x, y: this.y, w: this.w, h: this.h, id: this.id, color: this.color });
    }
    deserialize(data: string): this {
        let obj = JSON.parse(data);
        this.x = obj.x;
        this.y = obj.y;
        this.w = obj.w;
        this.h = obj.h;
        this.id = obj.id;
        this.color = obj.color;
        return this;
    }
}