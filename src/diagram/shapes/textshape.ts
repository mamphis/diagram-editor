import { BaseShape } from "./baseshape";
import * as p5 from 'p5';
import { Renderer2D } from "../../misc/renderer2d";
import { DiagramState } from "../../misc/diagramstate";

export class Text extends BaseShape {
    connectionPoints: { x: number; y: number; }[] = []
    text: string;
    constructor(x: number, y: number, w: number, h: number) {
        super("Text", x, y, w, h);
        this.text = "Text";
        this.shouldSnap = false;
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        p.textAlign('center', 'center');
        p.fill(0);
        p.strokeWeight(0)
        p.text(this.text, this.x, this.y, this.w, this.h);

        super.draw(p, canvas, state);
    }
}