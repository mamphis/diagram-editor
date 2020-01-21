import * as p5 from 'p5';
import { Settings } from '../misc/settings';
import { Connection } from './shapes/connection';
import { IShape } from './shapes/ishape';
import { Rectangle } from './shapes/rectangle';
import { Renderer2D } from '../misc/renderer2d';
export class Diagram {
    private background?: p5.Image;
    private connections: Connection[] = [];
    private shapes: IShape[] = [];
    public state: 'DRAWING' | 'CONNECTION' | 'VIEW' = "DRAWING";

    constructor(public p: p5, public canvas: Renderer2D) {
        // this.shapes.push(new Rectangle());
    }

    draw() {
        // Draw the background
        if (this.background) {
            this.p.image(this.background, 0, 0, this.p.width, this.p.height);
        } else {
            for (let x = 0; x < this.p.width; x += Settings.gridSize) {
                for (let y = 0; y < this.p.height; y += Settings.gridSize) {
                    this.p.point(x, y);
                }
            }
        }

        this.connections.forEach(c => c.draw(this));

        this.shapes.forEach(s => s.draw(this));
    }

}