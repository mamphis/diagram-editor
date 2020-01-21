import * as p5 from 'p5';
import { Settings } from '../misc/settings';
import { Connection } from './shapes/connection';
import { IShape } from './shapes/ishape';
import { Rectangle } from './shapes/rectangle';
import { Renderer2D } from '../misc/renderer2d';
import { DiagramState } from '../misc/diagramstate';
export class Diagram {
    private background?: p5.Image;
    private connections: Connection[] = [];
    public shapes: IShape[] = [];
    public state: DiagramState;

    constructor(public p: p5, public canvas: Renderer2D) {
        // this.shapes.push(new Rectangle());
        this.state = DiagramState.DRAWING;
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

        this.shapes.forEach(s => s.draw(this.p, this.canvas, this.state));
    }

}