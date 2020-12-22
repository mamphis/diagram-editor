import { BaseShape } from "./baseshape";
import { DiagramState } from "../../misc/diagramstate";
import { Renderer2D } from "../../misc/renderer2d";
import * as p5 from "p5";

export class Parallelogram extends BaseShape<Parallelogram>{
    connectionPoints: { x: number; y: number; }[] = [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 }
    ]

    slope: number;
    text:string ="";
    constructor(x: number, y: number, w: number, h: number) {
        super("Parallelogram", x, y, w, h);
        this.slope = w / 5;
        this.customProperties["Data"] = { slope: 'number', text: 'longtext' };
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), p.alpha(this.color))
        p.rectMode("corner");
        //p.rect(this.x, this.y, this.w, this.h);
        p.beginShape();
        if (this.slope >= 0){
            p.vertex(this.x + this.slope, this.y); 
            p.vertex(this.x + this.w, this.y);
            p.vertex(this.x + this.w - this.slope, this.y + this.h);
            p.vertex(this.x, this.y + this.h);
        } else {
            p.vertex(this.x, this.y);
            p.vertex(this.x + this.w + this.slope, this.y);
            p.vertex(this.x + this.w, this.y + this.h);
            p.vertex(this.x - this.slope, this.y + this.h);
        }
        p.endShape("close");
        p.noStroke();
        p.fill(0)
        p.textAlign('center', 'center');
        p.text(this.text, this.x, this.y, this.w, this.h);
        super.draw(p, canvas, state);
    }
    serialize(): string {
        return JSON.stringify({ x: this.x, y: this.y, w: this.w, h: this.h, id: this.id, color: this.color, text: this.text, slope: this.slope });
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
        this.slope = obj.slope || 0;
        return this;
    }
}