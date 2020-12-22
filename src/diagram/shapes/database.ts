import { BaseShape } from "./baseshape";
import * as p5 from 'p5';
import { Renderer2D } from "../../misc/renderer2d";
import { DiagramState } from "../../misc/diagramstate";

export class Database extends BaseShape<Database> {

    connectionPoints: { x: number; y: number; }[] = [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 }
    ]
    text: string = "";
    constructor(x: number, y: number, w: number, h: number) {
        super("Database", x, y, w, h);
        this.customProperties['Data'] = { text: 'longtext' };
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), p.alpha(this.color))
        p.rectMode("corner");
        p.ellipseMode('corner')
        p.strokeWeight(1);
        p.stroke(0);
        p.ellipse(this.x, this.y + this.h * 0.85, this.w, this.h * 0.15);
        p.noStroke();
        p.rect(this.x, this.y + this.h * 0.1, this.w, this.h * 0.81);
        p.strokeWeight(1);
        p.stroke(0);
        
        p.beginShape(1);
        p.vertex(this.x + this.w, this.y + this.h * 0.1);
        p.vertex(this.x + this.w, this.y + this.h * 0.9);
        p.vertex(this.x, this.y + this.h * 0.9);
        p.vertex(this.x, this.y + this.h * 0.1);
        p.endShape('close');

        p.ellipse(this.x, this.y, this.w, this.h * 0.15);



        p.noStroke();
        p.fill(0)
        p.textAlign('center', 'center');
        p.text(this.text, this.x, this.y, this.w, this.h);
        super.draw(p, canvas, state);
    }
    serialize(): string {
        return JSON.stringify({ x: this.x, y: this.y, w: this.w, h: this.h, id: this.id, color: this.color, text: this.text });
    }
    deserialize(data: string): this {
        let obj = JSON.parse(data);
        this.x = obj.x;
        this.y = obj.y;
        this.w = obj.w;
        this.h = obj.h;
        this.id = obj.id;
        this.color = obj.color;
        this.text = obj.text || "";
        return this;
    }
}