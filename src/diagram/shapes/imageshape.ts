import { BaseShape } from "./baseshape";
import * as p5 from 'p5';
import { Renderer2D } from "../../misc/renderer2d";
import { DiagramState } from "../../misc/diagramstate";
import { defaultImage } from "../../sketch";

export class Image extends BaseShape<Image> {
    connectionPoints: { x: number; y: number; }[] = [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 }
    ]
    image: string = "";
    img?: p5.Image;
    constructor(x: number, y: number, w: number, h: number) {
        super("Image", x, y, w, h);


        this.customProperties['Data'] = { image: 'image' };
    }

    draw(p: p5, canvas: Renderer2D, state: DiagramState): void {
        if (this.img) {
            p.image(this.img, this.x, this.y, this.w, this.h);
        } else {
            if (this.image) {
                this.loadImage(p, this.image);
            }
            p.image(defaultImage, this.x, this.y, this.w, this.h);
        }
        super.draw(p, canvas, state);
    }

    loadImage(p: p5, dataUrl: string) {
        this.image = dataUrl;
        try {
            this.img = p.loadImage(this.image);
        } catch {
            this.img = undefined;
        }
    }
    serialize(): string {
        return JSON.stringify({ x: this.x, y: this.y, w: this.w, h: this.h, id: this.id, color: this.color, image: this.image });
    }
    deserialize(data: string): this {
        let obj = JSON.parse(data);
        this.x = obj.x;
        this.y = obj.y;
        this.w = obj.w;
        this.h = obj.h;
        this.id = obj.id;
        this.color = obj.color;
        this.image = obj.image;
        return this;
    }
}