import { BaseShape } from "./baseshape";
import * as p5 from 'p5';
import { Renderer2D } from "../../misc/renderer2d";
import { DiagramState } from "../../misc/diagramstate";

export class Text extends BaseShape<Text> {
    connectionPoints: { x: number; y: number; }[] = []
    text: string;
    fontSize: number;
    fontColor: string;
    constructor(x: number, y: number, w: number, h: number) {
        super("Text", x, y, w, h);
        this.text = "Text";
        this.fontColor = "#000000"
        this.fontSize = 12;
        this.shouldSnap = false;

        this.customProperties['Data'] = { text: 'longtext', fontSize: 'number', fontColor: 'color' };
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        p.textAlign('center', 'center');
        p.rectMode('corner');
        p.fill(p.red(this.fontColor), p.green(this.fontColor), p.blue(this.fontColor), p.alpha(this.fontColor));
        p.strokeWeight(0)
        p.textSize(this.fontSize);
        p.text(this.text, this.x, this.y, this.w, this.h);

        super.draw(p, canvas, state);
    }
}